import { axiosInstance } from '@/shared/api';
import { useAuthStore } from '@/features/AccountAuthorization/model';
import type {
  UserStatisticsResponse,
  UserStockResponse,
} from '@/entities/user/types.ts';

const authStore = useAuthStore();

export const getUserStatistics = async (
  ceid: string
): Promise<UserStatisticsResponse> => {
  const payload: Record<string, string> = {
    session_id: authStore.sessionId as string,
    operation_name: 'user_statistics',
    ceid,
  };

  const response = await axiosInstance.get<UserStatisticsResponse>(
    '/api2/api/v1/user/statistics',
    {
      params: payload,
    }
  );

  return response.data;
};

export const getUserStock = async (
  ceid: string,
  signature: string
): Promise<UserStockResponse> => {
  const payload: Record<string, string> = {
    session_id: authStore.sessionId as string,
    operation_name: 'user_stock',
    ceid,
    signature,
  };

  const response = await axiosInstance.get<UserStockResponse>(
    '/api2/api/v1/user/stock',
    {
      params: payload,
    }
  );

  return response.data;
};
