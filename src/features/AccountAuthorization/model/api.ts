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
  };

  const response = await axiosInstance.post<AuthResponse>(
    '/api/eos/authorization',
    payload
  );

  return response.data;
};

export const authByPersonal = async (
  form: AuthByPersonalForm
): Promise<AuthResponse> => {
  const payload: Record<string, string> = {
    p_surname: form.surname,
    p_name: form.name,
    p_patronymic: form.patronymic,
    birthday: form.birthday,
    phone: form.phone.replace(/\D/g, '').slice(-10),
  };

  const response = await axiosInstance.post<AuthResponse>(
    '/api/eos/authorizationNa',
    payload
  );

  return response.data;
};
