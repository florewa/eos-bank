import { axiosInstance, paymentApi } from '@/shared/api/axiosInstance.ts';

export interface PaymentItem {
  title: string;
  count: number;
  price: number;
}

export interface PaymentQrResponse {
  ceid: string;
  amount: string;
  typePlatform?: string;
  ya_client_id?: string;
  payment_id: string;
  uid: string;
  url: string;
  sbp: string;
}

export interface GetPaymentQrParams {
  ceid: string;
  amount: number;
  typePlatform?: string;
  ya_client_id?: string;
}

export interface PaymentQrApiPayload {
  ceid: string;
  amount: string;
  typePlatform?: string;
  ya_client_id?: string;
}

export interface SuccessfulPayment {
  ceid: string;
  terminalId: number;
  price: number;
}

export interface PaymentResponse {
  success: boolean;
}

export async function paymentEvent(paymentData: PaymentItem[]) {
  try {
    const response = await paymentApi.post<{
      result: string;
      description: string;
    }>('/', paymentData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `Payment event failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function checkClient(ceid: string): Promise<boolean> {
  try {
    const response = await axiosInstance.post<{ status: boolean }>(
      '/api/eos/checksId',
      { ceid }
    );
    return response.data.status;
  } catch (error) {
    throw new Error(
      `Client check failed for CEID ${ceid}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function changeKKTStatus(id: number): Promise<boolean> {
  try {
    const response = await axiosInstance.post<{
      status: string;
      details: string;
    }>('/api/terminals/edit', { id, kkt: false });
    return response.data.status === 'success';
  } catch (error) {
    throw new Error(
      `KKT status update failed for terminal ${id}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getPaymentQr(
  params: GetPaymentQrParams
): Promise<PaymentQrResponse> {
  try {
    const payload: PaymentQrApiPayload = {
      ceid: params.ceid,
      amount: String(params.amount),
      typePlatform: params.typePlatform || 'terminal',
      ...(params.ya_client_id && { ya_client_id: params.ya_client_id }),
    };

    const response = await axiosInstance.post<PaymentQrResponse>(
      '/api/eos/paymentSBP',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `QR-code generation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function sendPaymentConfirmation(
  params: SuccessfulPayment
): Promise<PaymentResponse> {
  try {
    const response = await axiosInstance.post<PaymentResponse>(
      '/api/payments',
      params,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Payment confirmation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
