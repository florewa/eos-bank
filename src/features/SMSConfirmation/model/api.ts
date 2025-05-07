import type {
  CheckSMSRequest,
  CheckSMSResponse,
  SendSMSRequest,
  SendSMSResponse,
} from '@/features/SMSConfirmation/model/types.ts';
import { axiosInstance } from '@/shared/api';

export const sendSMS = async (
  payload: SendSMSRequest
): Promise<SendSMSResponse> => {
  const response = await axiosInstance.get<SendSMSResponse>(
    '/authorization/sms/send',
    {
      params: payload,
    }
  );

  return response.data;
};

export const checkSMS = async (
  payload: CheckSMSRequest
): Promise<CheckSMSResponse> => {
  const response = await axiosInstance.get<CheckSMSResponse>(
    '/authorization/sms/check',
    {
      params: payload,
    }
  );

  return response.data;
};
