import type {
  CheckSMSRequest,
  CheckSMSResponse,
  SendSMSRequest,
  SendSMSResponse,
} from '@/features/SMSConfirmation/model/types.ts';
import {
  createRequestSignatureString,
  createResponseSignatureString,
  signData,
  verifySignature,
} from '@/shared/utils/signature.ts';
import { axiosInstance } from '@/shared/api';

export const sendSMS = async (
  payload: SendSMSRequest
): Promise<SendSMSResponse> => {
  const signatureString = createRequestSignatureString({
    session_id: payload.session_id,
    operation_name: payload.operation_name,
    token_sms: payload.token_sms,
  });
  const computedSignature = signData(signatureString);

  const response = await axiosInstance.get<SendSMSResponse>(
    '/authorization/sms/send',
    {
      params: { ...payload, signature: computedSignature },
    }
  );

  const responseSignatureString = createResponseSignatureString(response.data);
  const isValid = verifySignature(
    responseSignatureString,
    response.data.signature
  );
  if (!isValid) {
    throw new Error('Невалидная подпись ответа');
  }

  return response.data;
};

export const checkSMS = async (
  payload: CheckSMSRequest
): Promise<CheckSMSResponse> => {
  const signatureString = createRequestSignatureString({
    session_id: payload.session_id,
    operation_name: payload.operation_name,
    token_sms: payload.token_sms,
    text_sms: payload.text_sms,
  });
  const computedSignature = signData(signatureString);

  const response = await axiosInstance.get<CheckSMSResponse>(
    '/authorization/sms/check',
    {
      params: { ...payload, signature: computedSignature },
    }
  );

  const responseSignatureString = createResponseSignatureString(response.data);
  const isValid = verifySignature(
    responseSignatureString,
    response.data.signature
  );
  if (!isValid) {
    throw new Error('Невалидная подпись ответа');
  }

  return response.data;
};
