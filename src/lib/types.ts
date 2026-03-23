export interface Transaction {
  transactionId: string;
  userId: string;
  timestamp: Date;
  amount: number;
  merchantCategory: string;
  city: string;
  status: 'Approved' | 'Flagged';
}

export interface RawTransaction {
  Transaction_ID: string;
  User_ID: string;
  Timestamp: string;
  Amount_USD: string;
  Merchant_Category: string;
  Location_City: string;
  Status: string;
}

export interface ImpossibleTravel {
  userId: string;
  city1: string;
  city2: string;
  time1: string;
  time2: string;
  gapMinutes: number;
  amount: number;
}

export interface MerchantFraud {
  name: string;
  total: number;
  fraud: number;
  rate: number;
}

export interface CityFraud {
  city: string;
  total: number;
  fraud: number;
  rate: number;
}

export interface RepeatOffender {
  userId: string;
  flagCount: number;
  totalAmount: number;
}

export interface FlaggedTransaction {
  transactionId: string;
  userId: string;
  amount: number;
  city: string;
  category: string;
  timestamp: string;
}

export interface Stats {
  totalTransactions: number;
  flaggedCount: number;
  fraudRate: number;
  impossibleTravelCount: number;
  weekendFraudPercent: number;
  peakFraudHour: number;
  topRiskCategory: {
    name: string;
    rate: number;
  };
}

export interface DataCache {
  transactions: Transaction[];
  stats: Stats;
  merchantFraud: MerchantFraud[];
  cityFraud: CityFraud[];
  impossibleTravel: ImpossibleTravel[];
  repeatOffenders: RepeatOffender[];
  heatmap: number[][];
  flaggedFeed: FlaggedTransaction[];
}
