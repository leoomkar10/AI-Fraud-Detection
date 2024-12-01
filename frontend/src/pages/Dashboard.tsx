import React, { useEffect } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { BalanceCard } from '../components/dashboard/BalanceCard';
import { TransactionForm } from '../components/dashboard/TransactionForm';
import { TransactionList } from '../components/dashboard/TransactionList';

export const Dashboard = () => {
  const { transactions, addTransaction, fetchTransactions, loading } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-6 md:grid-cols-2">
        <BalanceCard transactions={transactions} />
        <TransactionForm onSubmit={addTransaction} loading={loading} />
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};