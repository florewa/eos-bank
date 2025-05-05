import { axiosInstance } from '@/shared/api';

export const PAYMENT_URL = import.meta.env.VITE_PAYMENT_URL;

export async function paymentEvent() {
  const data = [
    {
      title: 'Фото в телеграм',
      count: 1,
      price: PHOTO_COST,
    },
  ];

  try {
    const response = await axiosInstance.post<{ result: string }>(
      PAYMENT_URL,
      data,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to payment event: ${error}`);
  }
}
