import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Transaction, TransactionStore, TransactionType } from '../types/transaction';
import { useAuthStore } from './authStore';
import { checkFraudStatus } from '../services/fraudDetection';

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  addTransaction: async (
    amount: number, 
    type: 'income' | 'expense', 
    transactionType: TransactionType,
    description: string
  ) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // Check fraud status
      const fraudCheck = await checkFraudStatus({
        amount,
        transaction_type: transactionType
      });

      const transaction = {
        userId: user.id,
        amount,
        type,
        transactionType,
        description,
        createdAt: serverTimestamp(),
        fraudCheck: {
          status: fraudCheck.fraudulent ? 'fraudulent' : 'safe',
          checkedAt: new Date().toISOString()
        }
      };

      // If fraudulent, store the transaction but mark it as fraudulent
      if (fraudCheck.fraudulent) {
        throw new Error('Transaction flagged as potentially fraudulent');
      }

      const docRef = await addDoc(collection(db, 'transactions'), transaction);
      
      const newTransaction: Transaction = {
        id: docRef.id,
        userId: user.id,
        amount,
        type,
        transactionType,
        description,
        createdAt: new Date().toISOString(),
        fraudCheck: {
          status: 'safe',
          checkedAt: new Date().toISOString()
        }
      };

      set(state => ({
        transactions: [newTransaction, ...state.transactions],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef,
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString();
          
        return {
          id: doc.id,
          userId: data.userId,
          amount: data.amount,
          type: data.type,
          transactionType: data.transactionType,
          description: data.description,
          createdAt,
          fraudCheck: {
            status: data.fraudCheck?.status || 'safe',
            checkedAt: data.fraudCheck?.checkedAt || createdAt
          }
        } as Transaction;
      });

      set({ transactions, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));