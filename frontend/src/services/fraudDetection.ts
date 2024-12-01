import axios from 'axios';
import { TransactionType } from '../types/transaction';

interface FraudDetectionRequest {
  amount: number;
  transaction_type: TransactionType;
}

interface FraudDetectionResponse {
  fraudulent: boolean;
  confidence: number;
  reason?: string;
}

const FRAUD_DETECTION_URL = 'http://127.0.0.1:5000/fraud-detection';
export const checkFraudStatus = async (data: FraudDetectionRequest): Promise<FraudDetectionResponse> => {
  try {
    // Validate transaction type
    if (!['CASH_IN', 'CASH_OUT', 'PAYMENT', 'TRANSFER'].includes(data.transaction_type)) {
      throw new Error('Invalid transaction type');
    }

    try {
      const response = await axios.post<FraudDetectionResponse>(
        FRAUD_DETECTION_URL,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        }
      );
      return response.data;
    } catch (apiError) {
      // If API call fails, fall back to local validation
      console.log('FastAPI service unavailable, using local validation');
      return validateTransaction(data);
    }
  } catch (error) {
    console.error('Fraud detection error:', error);
    throw new Error('Failed to check fraud status');
  }
};

// Local validation function for when API is unavailable
function validateTransaction(data: FraudDetectionRequest): FraudDetectionResponse {
  const { amount, transaction_type } = data;
  
  // Transaction type specific thresholds
  const thresholds: Record<TransactionType, { 
    maxAmount: number,
    riskLevel: number,
    requiresExtraVerification: boolean
  }> = {
    'CASH_IN': {
      maxAmount: 20000,
      riskLevel: 0.3,
      requiresExtraVerification: false
    },
    'CASH_OUT': {
      maxAmount: 5000,
      riskLevel: 0.6,
      requiresExtraVerification: true
    },
    'PAYMENT': {
      maxAmount: 15000,
      riskLevel: 0.4,
      requiresExtraVerification: false
    },
    'TRANSFER': {
      maxAmount: 10000,
      riskLevel: 0.5,
      requiresExtraVerification: true
    }
  };

  const threshold = thresholds[transaction_type];

  // Check for suspicious patterns
  const isSuspicious = (
    amount > threshold.maxAmount ||
    (threshold.requiresExtraVerification && amount > threshold.maxAmount * 0.8)
  );

  if (isSuspicious) {
    return {
      fraudulent: true,
      confidence: threshold.riskLevel,
      reason: `Suspicious ${transaction_type.toLowerCase()} transaction: Amount ${amount} exceeds normal limits`
    };
  }

  // Additional validation rules
  if (transaction_type === 'CASH_OUT' && amount > 3000) {
    return {
      fraudulent: true,
      confidence: 0.75,
      reason: 'Large cash withdrawal requires additional verification'
    };
  }

  if (transaction_type === 'TRANSFER' && amount > 7500) {
    return {
      fraudulent: true,
      confidence: 0.8,
      reason: 'Large transfer amount requires compliance review'
    };
  }

  // Transaction appears safe
  return {
    fraudulent: false,
    confidence: 0.95
  };
}