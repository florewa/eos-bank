export interface SendSMSRequest {
  session_id: string; // Идентификатор сессии
  token_sms: string; // Токен SMS
}

export interface SendSMSResponse {
  session_id: string;
  operation_name: string;
  status: boolean;
  result: {
    token_sms: string;
    sms_status: number; // Статус отправки SMS
  };
  error: string;
}

export interface CheckSMSRequest {
  session_id: string;
  token_sms: string;
  text_sms: string; // Код из SMS
}

export interface CheckSMSResponse {
  session_id: string;
  status: boolean;
  result: {
    token_sms: string;
    sms_check: number; // Результат проверки кода
  };
  signature: string;
  error: string;
}
