import Papa from 'papaparse';
import * as fs from 'fs';
import * as path from 'path';
import type {
  Transaction,
  RawTransaction,
  DataCache,
  Stats,
  MerchantFraud,
  CityFraud,
  ImpossibleTravel,
  RepeatOffender,
  FlaggedTransaction,
} from './types';

let cachedData: DataCache | null = null;

function parseCSV(): Transaction[] {
  const csvPath = path.join(process.cwd(), 'data', 'FinTech_Fraud_Logs.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  const result = Papa.parse<RawTransaction>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => ({
    transactionId: row.Transaction_ID,
    userId: row.User_ID,
    timestamp: new Date(row.Timestamp),
    amount: parseFloat(row.Amount_USD),
    merchantCategory: row.Merchant_Category,
    city: row.Location_City,
    status: row.Status as 'Approved' | 'Flagged',
  }));
}

function computeStats(transactions: Transaction[]): Stats {
  const flagged = transactions.filter((t) => t.status === 'Flagged');
  const flaggedCount = flagged.length;
  const totalTransactions = transactions.length;
  const fraudRate = (flaggedCount / totalTransactions) * 100;

  // Weekend fraud
  const weekendFraud = flagged.filter((t) => {
    const day = t.timestamp.getDay();
    return day === 0 || day === 6;
  }).length;
  const weekendFraudPercent = (weekendFraud / flaggedCount) * 100;

  // Peak hour
  const hourCounts: Record<number, number> = {};
  flagged.forEach((t) => {
    const hour = t.timestamp.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const peakFraudHour = Object.entries(hourCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  // Top risk category
  const merchantStats = computeMerchantFraud(transactions);
  const topRisk = merchantStats.sort((a, b) => b.rate - a.rate)[0];

  return {
    totalTransactions,
    flaggedCount,
    fraudRate: Math.round(fraudRate * 1000) / 1000,
    impossibleTravelCount: 0, // Will be updated
    weekendFraudPercent: Math.round(weekendFraudPercent * 10) / 10,
    peakFraudHour: parseInt(peakFraudHour || '0'),
    topRiskCategory: {
      name: topRisk?.name || 'N/A',
      rate: topRisk?.rate || 0,
    },
  };
}

function computeMerchantFraud(transactions: Transaction[]): MerchantFraud[] {
  const merchantMap = new Map<string, { total: number; fraud: number }>();

  transactions.forEach((t) => {
    const current = merchantMap.get(t.merchantCategory) || { total: 0, fraud: 0 };
    current.total++;
    if (t.status === 'Flagged') current.fraud++;
    merchantMap.set(t.merchantCategory, current);
  });

  return Array.from(merchantMap.entries())
    .map(([name, data]) => ({
      name,
      total: data.total,
      fraud: data.fraud,
      rate: Math.round((data.fraud / data.total) * 10000) / 100,
    }))
    .sort((a, b) => b.rate - a.rate);
}

function computeCityFraud(transactions: Transaction[]): CityFraud[] {
  const cityMap = new Map<string, { total: number; fraud: number }>();

  transactions.forEach((t) => {
    const current = cityMap.get(t.city) || { total: 0, fraud: 0 };
    current.total++;
    if (t.status === 'Flagged') current.fraud++;
    cityMap.set(t.city, current);
  });

  return Array.from(cityMap.entries())
    .map(([city, data]) => ({
      city,
      total: data.total,
      fraud: data.fraud,
      rate: Math.round((data.fraud / data.total) * 10000) / 100,
    }))
    .sort((a, b) => b.fraud - a.fraud);
}

function computeImpossibleTravel(transactions: Transaction[]): ImpossibleTravel[] {
  // Sort by user and timestamp
  const sorted = [...transactions].sort((a, b) => {
    if (a.userId !== b.userId) return a.userId.localeCompare(b.userId);
    return a.timestamp.getTime() - b.timestamp.getTime();
  });

  const impossibleTravels: ImpossibleTravel[] = [];
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    
    if (prev.userId !== curr.userId) continue;
    if (prev.city === curr.city) continue;
    
    const gapMinutes = (curr.timestamp.getTime() - prev.timestamp.getTime()) / 60000;
    
    // Flag if different city within 60 minutes
    if (gapMinutes < 60 && gapMinutes >= 0) {
      impossibleTravels.push({
        userId: curr.userId,
        city1: prev.city,
        city2: curr.city,
        time1: prev.timestamp.toISOString(),
        time2: curr.timestamp.toISOString(),
        gapMinutes: Math.round(gapMinutes),
        amount: curr.amount,
      });
    }
  }

  return impossibleTravels.sort((a, b) => a.gapMinutes - b.gapMinutes);
}

function computeRepeatOffenders(transactions: Transaction[]): RepeatOffender[] {
  const userMap = new Map<string, { flagCount: number; totalAmount: number }>();

  transactions
    .filter((t) => t.status === 'Flagged')
    .forEach((t) => {
      const current = userMap.get(t.userId) || { flagCount: 0, totalAmount: 0 };
      current.flagCount++;
      current.totalAmount += t.amount;
      userMap.set(t.userId, current);
    });

  return Array.from(userMap.entries())
    .filter(([, data]) => data.flagCount >= 2)
    .map(([userId, data]) => ({
      userId,
      flagCount: data.flagCount,
      totalAmount: Math.round(data.totalAmount * 100) / 100,
    }))
    .sort((a, b) => b.flagCount - a.flagCount);
}

function computeHeatmap(transactions: Transaction[]): number[][] {
  // 7 days (0=Sun, 6=Sat) x 24 hours
  const heatmap: number[][] = Array(7)
    .fill(null)
    .map(() => Array(24).fill(0));

  transactions
    .filter((t) => t.status === 'Flagged')
    .forEach((t) => {
      const day = t.timestamp.getDay();
      const hour = t.timestamp.getHours();
      heatmap[day][hour]++;
    });

  return heatmap;
}

function computeFlaggedFeed(transactions: Transaction[]): FlaggedTransaction[] {
  return transactions
    .filter((t) => t.status === 'Flagged')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 100)
    .map((t) => ({
      transactionId: t.transactionId,
      userId: t.userId,
      amount: t.amount,
      city: t.city,
      category: t.merchantCategory,
      timestamp: t.timestamp.toISOString(),
    }));
}

export async function getData(): Promise<DataCache> {
  if (cachedData) return cachedData;

  console.log('Parsing CSV and computing aggregations...');
  const transactions = parseCSV();
  
  const impossibleTravel = computeImpossibleTravel(transactions);
  const stats = computeStats(transactions);
  stats.impossibleTravelCount = impossibleTravel.length;

  cachedData = {
    transactions,
    stats,
    merchantFraud: computeMerchantFraud(transactions),
    cityFraud: computeCityFraud(transactions),
    impossibleTravel,
    repeatOffenders: computeRepeatOffenders(transactions),
    heatmap: computeHeatmap(transactions),
    flaggedFeed: computeFlaggedFeed(transactions),
  };

  console.log('Data loaded:', {
    total: stats.totalTransactions,
    flagged: stats.flaggedCount,
    impossibleTravel: impossibleTravel.length,
  });

  return cachedData;
}
