import { axiosInstance } from '@/shared/api';
import { useAuthStore } from '@/features/AccountAuthorization/model';
import type {
  UserInfoResponse,
  UserStatisticsResponse,
  UserStockResponse,
} from '@/entities/user/types.ts';

const authStore = useAuthStore();

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const payload = {
    session_id: authStore.sessionId as string,
  };

  const response = await axiosInstance.post<UserInfoResponse>(
    '/api/eos/user',
    payload,
    { skipGlobalLoader: true }
  );

  return response.data;
};

export const getUserStatistics = async (
  ceid: string
): Promise<UserStatisticsResponse> => {
  const payload: Record<string, string> = {
    session_id: authStore.sessionId as string,
    ceid,
  };

  const response = await axiosInstance.post<UserStatisticsResponse>(
    '/api/eos/user/statistics',
    payload,
    { skipGlobalLoader: true }
  );

  return response.data;
};

export const getUserStock = async (
  ceid: string
): Promise<UserStockResponse> => {
  const payload: Record<string, string> = {
    session_id: authStore.sessionId as string,
    ceid,
  };

  const response = await axiosInstance.post<UserStockResponse>(
    '/api/eos/user/stock',
    payload,
    { skipGlobalLoader: true }
  );

  return response.data;
};
