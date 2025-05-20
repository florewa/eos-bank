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
  const response = await axiosInstance.post<SendSMSResponse>(
    '/api/eos/authorization/sms/send',
    payload
  );

  return response.data;
};

export const checkSMS = async (
  payload: CheckSMSRequest
): Promise<CheckSMSResponse> => {
  const response = await axiosInstance.post<CheckSMSResponse>(
    '/api/eos/authorization/sms/check',
    payload
  );

  return response.data;
};
