import React from 'react';
import { DollarSign } from 'lucide-react';
import { Transaction } from '../../types/transaction';

interface BalanceCardProps {
  transactions: Transaction[];
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ transactions }) => {
  const totalBalance = transactions.reduce((acc, curr) => {
    return acc + (curr.type === 'income' ? curr.amount : -curr.amount);
  }, 0);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Balance Overview</h2>
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <DollarSign className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Current Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};