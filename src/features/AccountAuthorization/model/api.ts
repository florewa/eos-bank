import {
  signData,
  createRequestSignatureString,
  verifySignature,
  createResponseSignatureString,
} from '@/shared/utils/signature';
import type {
  AuthByIdForm,
  AuthByPersonalForm,
  AuthResponse,
} from '@/features/AccountAuthorization/model/types.ts';
import { axiosInstance } from '@/shared/api';

export const authById = async (form: AuthByIdForm): Promise<AuthResponse> => {
  const payload: Record<string, string> = {
    ceid: form.ceid,
    birthday: form.birthday,
    phone: form.phone.replace(/\D/g, '').slice(-10),
    operation_name: 'authorization',
  };

  const signatureString = createRequestSignatureString(payload);
  console.log('AuthById signature string:', signatureString);
  const computedSignature = signData(signatureString);
  console.log('AuthById signature:', computedSignature);

  const response = await axiosInstance.get<AuthResponse>('/authorization', {
    params: { ...payload, signature: computedSignature },
  });

  const responseSignatureString = createResponseSignatureString(response.data);
  console.log('AuthById response signature string:', responseSignatureString);
  const isValid = verifySignature(
    responseSignatureString,
    response.data.signature
  );
  console.log('AuthById response signature valid:', isValid);
  if (!isValid) {
    throw new Error('Невалидная подпись ответа');
  }

  return response.data;
};

// Аналогично для authByPersonal
export const authByPersonal = async (
  form: AuthByPersonalForm
): Promise<AuthResponse> => {
  const payload: Record<string, string> = {
    surname: form.surname,
    name: form.name,
    patronymic: form.patronymic,
    birthday: form.birthday,
    phone: form.phone.replace(/\D/g, '').slice(-10),
    operation_name: 'authorization',
  };

  const signatureString = createRequestSignatureString(payload);
  console.log('AuthByPersonal signature string:', signatureString);
  const computedSignature = signData(signatureString);
  console.log('AuthByPersonal signature:', computedSignature);

  const response = await axiosInstance.get<AuthResponse>('/authorization', {
    params: { ...payload, signature: computedSignature },
  });

  const responseSignatureString = createResponseSignatureString(response.data);
  console.log(
    'AuthByPersonal response signature string:',
    responseSignatureString
  );
  const isValid = verifySignature(
    responseSignatureString,
    response.data.signature
  );
  console.log('AuthByPersonal response signature valid:', isValid);
  if (!isValid) {
    throw new Error('Невалидная подпись ответа');
  }

  return response.data;
};
