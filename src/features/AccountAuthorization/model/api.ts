import { axiosInstance } from '@/shared/api';
import type {
  AuthByIdForm,
  AuthByPersonalForm,
  AuthResponse,
} from '@/features/AccountAuthorization/model/types.ts';

interface AuthByIdPayload {
  ceid: string;
  birthday: string;
  phone: string;
  operation_name: string;
  signature: string;
}

interface AuthByPersonalPayload {
  p_last_name: string;
  p_first_name: string;
  p_patronymic: string;
  birthday: string;
  phone: string;
  operation_name: string;
  signature: string;
}

export const authById = async (
  form: AuthByIdForm,
  signature: string
): Promise<AuthResponse> => {
  const payload: AuthByIdPayload = {
    ceid: form.ceid,
    birthday: form.birthday,
    phone: form.phone.replace(/\D/g, '').slice(-10),
    operation_name: 'authorization',
    signature,
  };

  const response = await axiosInstance.get<AuthResponse>(
    '/api2/api/v1/authorization',
    { params: payload }
  );
  return response.data;
};

export const authByPersonal = async (
  form: AuthByPersonalForm,
  signature: string
): Promise<AuthResponse> => {
  const payload: AuthByPersonalPayload = {
    p_last_name: form.surname,
    p_first_name: form.name,
    p_patronymic: form.patronymic,
    birthday: form.birthday,
    phone: form.phone.replace(/\D/g, '').slice(-10), // Форматируем телефон
    operation_name: 'authorizationNa',
    signature,
  };

  const response = await axiosInstance.get<AuthResponse>(
    '/api2/api/v1/authorizationNa',
    { params: payload }
  );
  return response.data;
};
