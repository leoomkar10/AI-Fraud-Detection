export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  transactionType: 'CASH_IN' | 'CASH_OUT' | 'PAYMENT' | 'TRANSFER';
  description: string;
  createdAt: string;
  fraudCheck: {
    status: 'safe' | 'fraudulent';
    checkedAt: string;
  };
}

export interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (
    amount: number, 
    type: 'income' | 'expense', 
    transactionType: 'CASH_IN' | 'CASH_OUT' | 'PAYMENT' | 'TRANSFER',
    description: string
  ) => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

export type TransactionType = 'CASH_IN' | 'CASH_OUT' | 'PAYMENT' | 'TRANSFER';