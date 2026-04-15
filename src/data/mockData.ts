export const mockUser = {
  name: 'Alex',
  milestonesCompleted: 3,
  totalMilestones: 9,
};

export const mockNetWorth = {
  total: 4850,
  totalAssets: 12300,
  totalLiabilities: 7450,
};

export const mockCashflow = {
  monthlyIncome: 4200,
  monthlySpending: 3180,
  surplus: 1020,
};

export const mockCashflowHistory = [
  { month: 'Oct', income: 4200, spending: 3420, surplus: 780 },
  { month: 'Nov', income: 4200, spending: 3650, surplus: 550 },
  { month: 'Dec', income: 4200, spending: 4100, surplus: 100 },
  { month: 'Jan', income: 4200, spending: 3290, surplus: 910 },
  { month: 'Feb', income: 4200, spending: 3050, surplus: 1150 },
  { month: 'Mar', income: 4200, spending: 3180, surplus: 1020 },
];

export const mockSubscriptions = [
  { name: 'Netflix', amount: 15.99, category: 'Entertainment', color: '#E8DAFF' },
  { name: 'Spotify', amount: 9.99, category: 'Entertainment', color: '#C8F0D8' },
  { name: 'iCloud', amount: 2.99, category: 'Utilities', color: '#CCE9FF' },
  { name: 'ChatGPT', amount: 20.00, category: 'Productivity', color: '#FFF3CC' },
  { name: 'Gym', amount: 39.99, category: 'Health', color: '#FFE4CC' },
];

export const mockSpendingCategories = [
  { name: 'Housing', amount: 1200, budget: 1200, color: '#C8F0D8' },
  { name: 'Food & Dining', amount: 480, budget: 500, color: '#FFE4CC' },
  { name: 'Transport', amount: 210, budget: 250, color: '#CCE9FF' },
  { name: 'Entertainment', amount: 190, budget: 150, color: '#E8DAFF' },
  { name: 'Health', amount: 95, budget: 100, color: '#FFF3CC' },
  { name: 'Shopping', amount: 320, budget: 300, color: '#FFE4CC' },
  { name: 'Other', amount: 185, budget: 200, color: '#C5CEC7' },
];

export const mockDebts = [
  {
    id: '1',
    name: 'Credit Card',
    institution: 'Chase Sapphire',
    balance: 3200,
    interestRate: 22.9,
    minPayment: 65,
    payoffMonths: 68,
    color: '#FF6B6B',
  },
  {
    id: '2',
    name: 'Student Loan',
    institution: 'Navient',
    balance: 4250,
    interestRate: 5.8,
    minPayment: 120,
    payoffMonths: 42,
    color: '#FFE4CC',
  },
];

export const mockAccounts = [
  {
    id: '1',
    institution: 'Chase',
    name: 'Total Checking',
    type: 'checking',
    balance: 2840,
    isAsset: true,
  },
  {
    id: '2',
    institution: 'Marcus',
    name: 'High-Yield Savings',
    type: 'savings',
    balance: 9460,
    isAsset: true,
  },
  {
    id: '3',
    institution: 'Chase',
    name: 'Sapphire Preferred',
    type: 'credit',
    balance: -3200,
    isAsset: false,
  },
  {
    id: '4',
    institution: 'Navient',
    name: 'Student Loan',
    type: 'loan',
    balance: -4250,
    isAsset: false,
  },
];

export type MilestoneStatus = 'completed' | 'active' | 'locked';
export type MilestoneCategory = 'Budget' | 'Debt' | 'Savings' | 'Invest' | 'Boss';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  category: MilestoneCategory;
}

export const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'First Budget',
    description: 'Set up your monthly budget across all categories.',
    status: 'completed',
    category: 'Budget',
  },
  {
    id: '2',
    title: 'Link Accounts',
    description: 'Connect at least one bank account to MoneyBall.',
    status: 'completed',
    category: 'Budget',
  },
  {
    id: '3',
    title: 'Debt Mapped',
    description: 'Add all your debts so we can build a payoff plan.',
    status: 'completed',
    category: 'Debt',
  },
  {
    id: '4',
    title: 'Emergency Fund $1k',
    description: 'Save $1,000 as your first emergency buffer.',
    status: 'active',
    category: 'Savings',
  },
  {
    id: '5',
    title: 'Avalanche Mode',
    description: 'Start paying off your highest interest debt first.',
    status: 'locked',
    category: 'Debt',
  },
  {
    id: '6',
    title: '3-Month Buffer',
    description: 'Build a 3-month emergency fund.',
    status: 'locked',
    category: 'Savings',
  },
  {
    id: '7',
    title: 'BOSS: Debt Free',
    description: "Pay off all consumer debt. You're unstoppable.",
    status: 'locked',
    category: 'Boss',
  },
  {
    id: '8',
    title: 'First Investment',
    description: 'Open a brokerage or retirement account and invest.',
    status: 'locked',
    category: 'Invest',
  },
  {
    id: '9',
    title: 'BOSS: $10k Saved',
    description: 'Cross $10,000 in total savings. Elite tier.',
    status: 'locked',
    category: 'Boss',
  },
];

export const categoryColors: Record<string, string> = {
  Budget: '#C8F0D8',
  Debt: '#FFE4CC',
  Savings: '#CCE9FF',
  Invest: '#E8DAFF',
  Boss: '#FF6B6B',
};
