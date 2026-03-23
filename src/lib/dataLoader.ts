import fs from 'fs';
import path from 'path';

export interface Transaction {
  Transaction_ID: string;
  User_ID: string;
  Timestamp: string;
  Amount_USD: number;
  Merchant_Category: string;
  Location_City: string;
  Status: 'Approved' | 'Flagged';
}

let cachedData: Transaction[] | null = null;

export function loadTransactions(): Transaction[] {
  if (cachedData) return cachedData;

  const csvPath = path.join(process.cwd(), 'data', 'FinTech_Fraud_Logs.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const lines = raw.trim().split('\n');

  cachedData = lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      Transaction_ID: values[0],
      User_ID: values[1],
      Timestamp: values[2],
      Amount_USD: parseFloat(values[3]),
      Merchant_Category: values[4],
      Location_City: values[5],
      Status: values[6] as 'Approved' | 'Flagged',
    };
  });

  return cachedData;
}

// Stats API
export function getStats() {
  const transactions = loadTransactions();
  const flagged = transactions.filter(tx => tx.Status === 'Flagged');
  
  const userFlags = new Map<string, number>();
  for (const tx of flagged) {
    userFlags.set(tx.User_ID, (userFlags.get(tx.User_ID) || 0) + 1);
  }
  const velocitySpikeUsers = Array.from(userFlags.values()).filter(count => count > 1).length;

  const merchantStats = getMerchantStats();
  const highestRisk = merchantStats[0];

  // Detect impossible travel (same user, different city, < 60 min apart)
  const sortedByUser = [...transactions].sort((a, b) => {
    if (a.User_ID !== b.User_ID) return a.User_ID.localeCompare(b.User_ID);
    return new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime();
  });

  let impossibleTravel = 0;
  for (let i = 1; i < sortedByUser.length; i++) {
    const prev = sortedByUser[i - 1];
    const curr = sortedByUser[i];
    if (prev.User_ID === curr.User_ID && prev.Location_City !== curr.Location_City) {
      const timeDiff = (new Date(curr.Timestamp).getTime() - new Date(prev.Timestamp).getTime()) / 60000;
      if (timeDiff > 0 && timeDiff < 60) {
        impossibleTravel++;
      }
    }
  }

  return {
    totalTransactions: transactions.length,
    flaggedTransactions: flagged.length,
    impossibleTravel,
    velocitySpikeUsers,
    fraudRate: parseFloat(((flagged.length / transactions.length) * 100).toFixed(2)),
    highestRiskCategory: `${highestRisk?.name || 'N/A'} (${highestRisk?.fraudRate || 0}%)`,
  };
}

// City Stats API
export function getCityStats() {
  const transactions = loadTransactions();
  const cityMap = new Map<string, { total: number; flagged: number; amount: number; flaggedAmount: number }>();

  for (const tx of transactions) {
    const city = tx.Location_City;
    if (!cityMap.has(city)) {
      cityMap.set(city, { total: 0, flagged: 0, amount: 0, flaggedAmount: 0 });
    }
    const stats = cityMap.get(city)!;
    stats.total++;
    stats.amount += tx.Amount_USD;
    if (tx.Status === 'Flagged') {
      stats.flagged++;
      stats.flaggedAmount += tx.Amount_USD;
    }
  }

  return Array.from(cityMap.entries())
    .map(([city, stats]) => ({
      city,
      transactions: stats.total,
      flagged: stats.flagged,
      fraudAmount: Math.round(stats.flaggedAmount),
      totalAmount: Math.round(stats.amount),
      rate: parseFloat(((stats.flagged / stats.total) * 100).toFixed(2)),
      trend: 0, // Mock calculation removed
    }))
    .sort((a, b) => b.fraudAmount - a.fraudAmount);
}

// Merchant Stats API
export function getMerchantStats() {
  const transactions = loadTransactions();
  const merchantMap = new Map<string, { total: number; flagged: number; amount: number; flaggedAmount: number }>();

  for (const tx of transactions) {
    const merchant = tx.Merchant_Category;
    if (!merchantMap.has(merchant)) {
      merchantMap.set(merchant, { total: 0, flagged: 0, amount: 0, flaggedAmount: 0 });
    }
    const stats = merchantMap.get(merchant)!;
    stats.total++;
    stats.amount += tx.Amount_USD;
    if (tx.Status === 'Flagged') {
      stats.flagged++;
      stats.flaggedAmount += tx.Amount_USD;
    }
  }

  return Array.from(merchantMap.entries())
    .map(([name, stats]) => ({
      name,
      value: stats.total,
      fraudRate: parseFloat(((stats.flagged / stats.total) * 100).toFixed(2)),
      amount: Math.round(stats.amount),
      flaggedAmount: Math.round(stats.flaggedAmount),
      flagged: stats.flagged,
    }))
    .sort((a, b) => b.fraudRate - a.fraudRate);
}

// Heatmap API - fraud by day/hour
export function getHeatmapData() {
  const transactions = loadTransactions();
  const heatmap = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.Status !== 'Flagged') continue;
    const date = new Date(tx.Timestamp);
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const hour = date.getHours();
    const key = `${day}-${hour}`;
    heatmap.set(key, (heatmap.get(key) || 0) + 1);
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.flatMap(day =>
    Array.from({ length: 24 }).map((_, hour) => ({
      day,
      hour,
      count: heatmap.get(`${day}-${hour}`) || 0,
      rate: 0, // Will be calculated if needed
    }))
  );
}

// Feed API - recent flagged transactions
export function getRecentFlagged(limit = 20) {
  const transactions = loadTransactions();
  return transactions
    .filter(tx => tx.Status === 'Flagged')
    .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())
    .slice(0, limit)
    .map(tx => ({
      id: tx.Transaction_ID,
      user: tx.User_ID,
      amount: tx.Amount_USD,
      city: tx.Location_City,
      merchant: tx.Merchant_Category,
      timestamp: tx.Timestamp,
    }));
}

// Repeat Offenders API
export function getRepeatOffenders(limit = 12) {
  const transactions = loadTransactions();
  const userStats = new Map<string, { flags: number; amount: number; txCount: number }>();

  for (const tx of transactions) {
    if (!userStats.has(tx.User_ID)) {
      userStats.set(tx.User_ID, { flags: 0, amount: 0, txCount: 0 });
    }
    const stats = userStats.get(tx.User_ID)!;
    stats.txCount++;
    if (tx.Status === 'Flagged') {
      stats.flags++;
      stats.amount += tx.Amount_USD;
    }
  }

  return Array.from(userStats.entries())
    .filter(([_, stats]) => stats.flags > 0)
    .map(([userId, stats]) => ({
      userId,
      flags: stats.flags,
      totalAmount: Math.round(stats.amount),
      txCount: stats.txCount,
    }))
    .sort((a, b) => b.flags - a.flags)
    .slice(0, limit);
}

// Velocity API - transaction volume by hour
export function getVelocityData() {
  const transactions = loadTransactions();
  const hourlyData = new Map<number, { volume: number; spikes: number }>();

  for (let i = 0; i < 24; i++) {
    hourlyData.set(i, { volume: 0, spikes: 0 });
  }

  for (const tx of transactions) {
    const hour = new Date(tx.Timestamp).getHours();
    const data = hourlyData.get(hour)!;
    data.volume++;
    if (tx.Status === 'Flagged') {
      data.spikes++;
    }
  }

  return Array.from(hourlyData.entries()).map(([hour, data]) => ({
    time: `${hour}:00`,
    hour,
    volume: data.volume,
    spikes: data.spikes,
  }));
}

// Impossible Travel API
export function getImpossibleTravel(limit = 20) {
  const transactions = loadTransactions();
  
  // Group by user and sort by timestamp
  const userTx = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    if (!userTx.has(tx.User_ID)) {
      userTx.set(tx.User_ID, []);
    }
    userTx.get(tx.User_ID)!.push(tx);
  }

  const travelCases: Array<{
    userId: string;
    tx1: { city: string; timestamp: string; amount: number };
    tx2: { city: string; timestamp: string; amount: number };
    timeDiffMinutes: number;
  }> = [];

  for (const [userId, txs] of userTx.entries()) {
    const sorted = txs.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
    
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      
      if (prev.Location_City !== curr.Location_City) {
        const timeDiff = (new Date(curr.Timestamp).getTime() - new Date(prev.Timestamp).getTime()) / 60000;
        
        if (timeDiff > 0 && timeDiff < 60) {
          travelCases.push({
            userId,
            tx1: { city: prev.Location_City, timestamp: prev.Timestamp, amount: prev.Amount_USD },
            tx2: { city: curr.Location_City, timestamp: curr.Timestamp, amount: curr.Amount_USD },
            timeDiffMinutes: Math.round(timeDiff),
          });
        }
      }
    }
  }

  return travelCases
    .sort((a, b) => a.timeDiffMinutes - b.timeDiffMinutes)
    .slice(0, limit);
}

// Threshold API - transactions above/below $500
export function getThresholdData() {
  const transactions = loadTransactions();
  const threshold = 500;

  const below = { count: 0, flagged: 0, amount: 0 };
  const above = { count: 0, flagged: 0, amount: 0 };

  for (const tx of transactions) {
    if (tx.Amount_USD < threshold) {
      below.count++;
      below.amount += tx.Amount_USD;
      if (tx.Status === 'Flagged') below.flagged++;
    } else {
      above.count++;
      above.amount += tx.Amount_USD;
      if (tx.Status === 'Flagged') above.flagged++;
    }
  }

  return {
    threshold,
    below: { count: below.count, flagged: below.flagged, amount: Math.round(below.amount) },
    above: { count: above.count, flagged: above.flagged, amount: Math.round(above.amount) },
  };
}

// City Pairs API - for network graph
export function getCityPairs() {
  const transactions = loadTransactions();
  
  const userTx = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    if (!userTx.has(tx.User_ID)) {
      userTx.set(tx.User_ID, []);
    }
    userTx.get(tx.User_ID)!.push(tx);
  }

  const pairCounts = new Map<string, number>();
  const cities = new Set<string>();

  for (const txs of userTx.values()) {
    const sorted = txs.sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
    
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      
      if (prev.Location_City !== curr.Location_City) {
        const pair = [prev.Location_City, curr.Location_City].sort().join('->');
        pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
        cities.add(prev.Location_City);
        cities.add(curr.Location_City);
      }
    }
  }

  const nodes = Array.from(cities).map((id, index) => ({ id, group: index % 3 }));
  
  const links = Array.from(pairCounts.entries())
    .map(([pair, value]) => {
      const [source, target] = pair.split('->');
      return { source, target, value };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  return { nodes, links };
}

// All transactions for table/export
export function getAllTransactions(page = 1, pageSize = 50, filters?: { status?: string; city?: string; merchant?: string }) {
  let transactions = loadTransactions();

  if (filters?.status) {
    transactions = transactions.filter(tx => tx.Status === filters.status);
  }
  if (filters?.city) {
    transactions = transactions.filter(tx => tx.Location_City === filters.city);
  }
  if (filters?.merchant) {
    transactions = transactions.filter(tx => tx.Merchant_Category === filters.merchant);
  }

  const total = transactions.length;
  const sorted = transactions.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return {
    data: paginated,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
