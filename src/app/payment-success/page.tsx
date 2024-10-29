'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

interface PaymentVerificationStatus {
  isLoading: boolean;
  isSuccess: boolean;
  error?: string;
  transactionDetails?: {
    transactionId: string;
    amount: number;
    status: string;
    reference: string;
  };
}

const API_URL = 'http://localhost:3001';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<PaymentVerificationStatus>({
    isLoading: true,
    isSuccess: false,
  });

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get('transaction_id');
        const txRef = searchParams.get('tx_ref');

        if (!transactionId || !txRef) {
          throw new Error('Invalid payment parameters');
        }

        // Verify payment with backend
        const response = await axios.get(`${API_URL}/verify-payment`, {
          params: {
            tx_ref: txRef,
            transactionId
          }
        });
        console.log(response.data);

        setVerificationStatus({
          isLoading: false,
          isSuccess: response.data.verified,
          transactionDetails: {
            transactionId,
            amount: response.data.amount,
            status: response.data.verified,
            reference: txRef
          }
        });

        // Redirect after successful verification
        if (response.data.verified) {
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }

      } catch (error) {
        setVerificationStatus({
          isLoading: false,
          isSuccess: false,
          error: 'Payment verification failed'
        });
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {verificationStatus.isLoading ? (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Verifying your payment...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-success-pop">
              {verificationStatus.isSuccess ? (
                <CheckCircle className="w-16 h-16 text-green-500 animate-success-check mx-auto" />
              ) : (
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              )}
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              {verificationStatus.isSuccess ? 'Payment Successful!' : 'Payment Verification Failed'}
            </h1>

            {verificationStatus.transactionDetails && (
              <div className="mt-6 space-y-2 text-left bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Transaction ID:</span>{' '}
                  {verificationStatus.transactionDetails.transactionId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Reference:</span>{' '}
                  {verificationStatus.transactionDetails.reference}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Amount:</span>{' '}
                  ${verificationStatus.transactionDetails.amount?.toFixed(2)}
                </p>
              </div>
            )}

            {verificationStatus.error && (
              <p className="mt-2 text-sm text-red-500">{verificationStatus.error}</p>
            )}

            <p className="mt-4 text-gray-600">
              {verificationStatus.isSuccess 
                ? 'Redirecting you back to the menu...'
                : 'Please try your purchase again.'}
            </p>

            {!verificationStatus.isSuccess && (
              <button
                onClick={() => router.push('/')}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Return to Menu
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 