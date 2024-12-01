import { TransactionType } from '../types/transaction';

export const getTransactionTypeOptions = (type: 'income' | 'expense'): TransactionType[] => {
  if (type === 'income') {
    return ['CASH_IN', 'PAYMENT', 'TRANSFER'];
  }
  return ['CASH_OUT', 'PAYMENT', 'TRANSFER'];
};

export const getTransactionTypeLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    'CASH_IN': 'Cash Deposit',
    'CASH_OUT': 'Cash Withdrawal',
    'PAYMENT': 'Payment',
    'TRANSFER': 'Transfer'
  };
  return labels[type];
};