import { axiosInstance } from '@/shared/api';

export const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL;

export interface PaymentItem {
  title: string;
  count: number;
  price: number;
}

export async function paymentEvent(paymentData: PaymentItem[]) {
  try {
    const response = await axiosInstance.post<{ result: string }>(
      PAYMENT_URL,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Payment event API call failed:', error);
    throw new Error(
      `Failed to process payment: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
