export const statsData = {
  totalTransactions: 199619,
  flaggedTransactions: 669,
  impossibleTravel: 2978,
  velocitySpikeUsers: 150,
  fraudRate: 0.34,
  highestRiskCategory: "Crypto (4.36%)"
};

export const merchantData = [
  { name: "Crypto", value: 450, fraudRate: 4.36 },
  { name: "Electronics", value: 320, fraudRate: 3.12 },
  { name: "Groceries", value: 1200, fraudRate: 0 },
  { name: "Clothing", value: 800, fraudRate: 0 },
  { name: "Dining", value: 950, fraudRate: 0 },
  { name: "Travel", value: 410, fraudRate: 0.5 },
];

export const velocityData = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  volume: Math.floor(Math.random() * 5000) + 1000,
  spikes: Math.floor(Math.random() * 50)
}));

export const travelData = [
  { id: "USR-14397", transition: "Dubai → Sydney", gap: "3 min", amount: 1282, risk: "CRITICAL" },
  { id: "USR-09211", transition: "London → Tokyo", gap: "12 min", amount: 890, risk: "HIGH" },
  { id: "USR-55102", transition: "NY → Paris", gap: "45 min", amount: 3200, risk: "HIGH" },
  { id: "USR-33019", transition: "Berlin → Rome", gap: "15 min", amount: 450, risk: "MEDIUM" },
  { id: "USR-11942", transition: "Miami → LA", gap: "5 min", amount: 120, risk: "HIGH" }
];

export const cityFraudData = [
  { city: "Dubai", fraudAmount: 245000, transactions: 12400, flagged: 298, rate: 2.4, trend: 12 },
  { city: "London", fraudAmount: 189000, transactions: 10500, flagged: 189, rate: 1.8, trend: -5 },
  { city: "New York", fraudAmount: 156000, transactions: 10400, flagged: 156, rate: 1.5, trend: 3 },
  { city: "Sydney", fraudAmount: 124000, transactions: 10333, flagged: 124, rate: 1.2, trend: 8 },
  { city: "Tokyo", fraudAmount: 89000, transactions: 9889, flagged: 89, rate: 0.9, trend: -2 },
  { city: "Paris", fraudAmount: 67000, transactions: 11167, flagged: 67, rate: 0.6, trend: -8 }
];

export const heatmapData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].flatMap(day => 
  Array.from({ length: 24 }).map((_, hour) => ({
    day,
    hour,
    rate: (day === "Sat" || day === "Sun") ? Math.random() * 3 : Math.random() * 1
  }))
);

export const offendersData = [
  { rank: 1, id: "USR-01034", flags: 7, tx: 45, amount: 12500, status: "Investigating" },
  { rank: 2, id: "USR-09921", flags: 5, tx: 12, amount: 8400, status: "Frozen" },
  { rank: 3, id: "USR-14402", flags: 4, tx: 8, amount: 3200, status: "Active" },
  { rank: 4, id: "USR-55219", flags: 4, tx: 104, amount: 9800, status: "Investigating" },
  { rank: 5, id: "USR-22108", flags: 3, tx: 15, amount: 4100, status: "Active" }
];

export const thresholdData = {
  below: { count: 185002, flagged: 0 },
  above: { count: 14617, flagged: 669 }
};

export const feedData = [
  { id: "TX-9912", user: "USR-01034", amount: 4500, city: "Dubai", merchant: "Crypto", timestamp: "Just now" },
  { id: "TX-9911", user: "USR-14397", amount: 3200, city: "Sydney", merchant: "Electronics", timestamp: "1m ago" },
  { id: "TX-9910", user: "USR-09921", amount: 1282, city: "London", merchant: "Crypto", timestamp: "3m ago" },
  { id: "TX-9909", user: "USR-55102", amount: 950, city: "Paris", merchant: "Travel", timestamp: "5m ago" },
  { id: "TX-9908", user: "USR-33019", amount: 890, city: "Tokyo", merchant: "Electronics", timestamp: "12m ago" }
];

// Graph Nodes and Links instead of just simple pairs
export const cityPairsData = {
  nodes: [
    { id: "Dubai", group: 1 },
    { id: "Sydney", group: 2 },
    { id: "London", group: 1 },
    { id: "Tokyo", group: 2 },
    { id: "New York", group: 1 },
    { id: "Paris", group: 2 },
  ],
  links: [
    { source: "Dubai", target: "Sydney", value: 10 },
    { source: "London", target: "Tokyo", value: 8 },
    { source: "New York", target: "Paris", value: 6 },
    { source: "Dubai", target: "London", value: 4 },
  ]
};
