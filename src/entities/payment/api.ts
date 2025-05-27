import { axiosInstance } from '@/shared/api';
import { useAuthStore } from '@/features/AccountAuthorization/model';
import type {
  UserInfoResponse,
  UserStatisticsResponse,
  UserStockResponse,
} from '@/entities/user/types.ts';
import type { QrResponse } from '@/entities/payment/types.ts';

const authStore = useAuthStore();

export const getSBPLink = async (
  ceid: string,
  amount: string
): Promise<QrResponse> => {
  const payload = {
    ceid,
    amount,
  };

  const response = await axiosInstance.post<QrResponse>(
    '/api/eos/paymentSBP',
    payload
  );

  return response.data;
};
