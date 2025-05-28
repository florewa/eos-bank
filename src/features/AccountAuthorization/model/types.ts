export interface AuthByIdForm {
  ceid: string; // Идентификационный номер
  birthday: string; // Дата рождения (DD.MM.YYYY)
  phone: string; // Номер телефона
  isAgreementAccepted: boolean; // Согласие с условиями
}

export interface AuthByPersonalForm {
  surname: string; // Фамилия
  name: string; // Имя
  patronymic: string; // Отчество
  birthday: string; // Дата рождения (DD.MM.YYYY)
  phone: string; // Номер телефона
  isAgreementAccepted: boolean; // Согласие с условиями
}

export interface AuthResponse {
  session_id: string; // Идентификатор сессии
  status: boolean; // Статус операции
  result: {
    auth_code: 0 | 1 | 2; // Результат авторизации: 0 - не авторизован, 1 - авторизован, 2 - авторизован, но доступ закрыт
    token_sms: string; // Токен для отправки SMS
    authorization_status?: string; // Для сценария 2
    status_text_lk?: string; // Для сценария 2
  };
  signature: string; // Подпись в HEX
  error: string; // Статус ошибки
}

export interface LoginPayload {
  phone: string;
  method: 'id' | 'personal';
  data: AuthByIdForm | AuthByPersonalForm;
}
