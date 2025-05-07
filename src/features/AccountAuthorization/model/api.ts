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

  const response = await axiosInstance.get<AuthResponse>(
    '/api2/api/v1/authorization',
    {
      params: payload,
    }
  );

  return response.data;
};

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

  const response = await axiosInstance.get<AuthResponse>(
    '/api2/api/v1/authorization',
    {
      params: payload,
    }
  );

  return response.data;
};
