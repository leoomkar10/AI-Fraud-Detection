import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, AlertTriangle, ShieldCheck, Loader } from 'lucide-react';
import { Button } from '../ui/Button';
import { checkFraudStatus } from '../../services/fraudDetection';
import { TransactionType } from '../../types/transaction';
import { getTransactionTypeOptions, getTransactionTypeLabel } from '../../utils/transactionUtils';

interface TransactionFormProps {
  onSubmit: (
    amount: number, 
    type: 'income' | 'expense', 
    transactionType: TransactionType,
    description: string
  ) => Promise<void>;
  loading: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, loading }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [transactionType, setTransactionType] = useState<TransactionType>('CASH_IN');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fraudStatus, setFraudStatus] = useState<'checking' | 'fraudulent' | 'safe' | null>(null);
  const [fraudReason, setFraudReason] = useState<string | null>(null);

  useEffect(() => {
    const options = getTransactionTypeOptions(type);
    if (!options.includes(transactionType)) {
      setTransactionType(options[0]);
    }
  }, [type, transactionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFraudStatus(null);
    setFraudReason(null);

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      setFraudStatus('checking');
      const fraudCheck = await checkFraudStatus({
        amount: Number(amount),
        transaction_type: transactionType
      });

      if (fraudCheck.fraudulent) {
        setFraudStatus('fraudulent');
        setFraudReason(fraudCheck.reason || 'Transaction appears suspicious');
        setError('This transaction has been flagged as potentially fraudulent');
        return;
      }

      setFraudStatus('safe');
      await onSubmit(Number(amount), type, transactionType, description.trim());
      
      // Reset form on success
      setAmount('');
      setDescription('');
      setType('income');
      setTransactionType('CASH_IN');
    } catch (error: any) {
      setError(error.message || 'Failed to process transaction');
      setFraudStatus(null);
    }
  };

  const transactionTypeOptions = getTransactionTypeOptions(type);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">{error}</p>
              {fraudReason && <p className="text-sm mt-1">{fraudReason}</p>}
            </div>
          </div>
        )}

        {fraudStatus === 'checking' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded flex items-center">
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            <span>Verifying transaction safety...</span>
          </div>
        )}

        {fraudStatus === 'safe' && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2" />
            <span>Transaction verified as safe</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Transaction Type
          </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as TransactionType)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {transactionTypeOptions.map((option) => (
              <option key={option} value={option}>
                {getTransactionTypeLabel(option)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Transaction description"
            required
          />
        </div>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant={type === 'income' ? 'primary' : 'outline'}
            onClick={() => setType('income')}
            className="flex-1"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Income
          </Button>
          <Button
            type="button"
            variant={type === 'expense' ? 'primary' : 'outline'}
            onClick={() => setType('expense')}
            className="flex-1"
          >
            <MinusCircle className="w-4 h-4 mr-2" />
            Expense
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={loading || fraudStatus === 'checking'}
        >
          {fraudStatus === 'checking' ? 'Verifying Transaction...' : 'Add Transaction'}
        </Button>
      </form>
    </div>
  );
};