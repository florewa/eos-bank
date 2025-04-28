export interface SendSMSRequest {
  session_id: string; // Идентификатор сессии
  operation_name: string;
  token_sms: string; // Токен SMS
  signature?: string; // Подпись в HEX
}

export interface SendSMSResponse {
  session_id: string;
  operation_name: string;
  status: boolean;
  result: {
    token_sms: string;
    sms_status: number; // Статус отправки SMS
  };
  signature: string;
  error: string;
}

export interface CheckSMSRequest {
  session_id: string;
  operation_name: string;
  token_sms: string;
  text_sms: string; // Код из SMS
  signature?: string;
}

export interface CheckSMSResponse {
  session_id: string;
  operation_name: string;
  status: boolean;
  result: {
    token_sms: string;
    sms_check: number; // Результат проверки кода
  };
  signature: string;
  error: string;
}
