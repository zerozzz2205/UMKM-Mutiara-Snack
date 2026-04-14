export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  category: string;
}

export interface DashboardStats {
  omzetBersih: number;
  operationalCost: number;
  netProfitMargin: number;
  cashOnHand: number;
  bankBalance: number;
  debtPiutang: number;
}
