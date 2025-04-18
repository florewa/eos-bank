export interface SendSMSRequest {
  session_id: string; // Идентификатор сессии
  operation_name: string; // Название операции, например 'authorization_sms_send'
  token_sms: string; // Токен SMS
  signature: string; // Подпись в HEX
}

export interface SendSMSResponse {
  session_id: string;
  operation_name: string;
  status: boolean;
  result: {
    token_sms: string;
    sms_status: number; // Статус отправки SMS (1 - успешно)
  };
  signature: string;
  error: string;
}

export interface CheckSMSRequest {
  session_id: string;
  operation_name: string; // Например, 'authorization_sms_check'
  token_sms: string;
  text_sms: string; // Код из SMS
  signature: string;
}

export interface CheckSMSResponse {
  session_id: string;
  operation_name: string;
  status: boolean;
  result: {
    token_sms: string;
    sms_check: number; // Результат проверки кода (1 - успешно)
  };
  signature: string;
  error: string;
}
