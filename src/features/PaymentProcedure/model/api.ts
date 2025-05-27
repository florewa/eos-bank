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

interface PaymentQrApiPayload {
  ceid: string;
  amount: string;
  typePlatform?: string;
  ya_client_id?: string;
}

const TERMINAL_ID = window.TERMINAL_ID;

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
    console.error('Payment event API call failed:', error);
    throw new Error(
      `Failed to process payment: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function checkClient(ceid: string): Promise<boolean> {
  try {
    const response = await axiosInstance.post<{ status: boolean }>(
      '/api/eos/checksId',
      {
        ceid: ceid,
      }
    );
    return response.data.status;
  } catch (error) {
    console.error(`Failed to check client with CEID ${ceid}:`, error);
    throw new Error(
      `Failed to check client status for CEID ${ceid}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function changeKKTStatus(id: number): Promise<boolean> {
  try {
    const payload = {
      id: id,
      kkt: false,
    };

    const response = await axiosInstance.post<{
      status: string;
      details: string;
    }>('/api/terminals/edit', payload);

    return response.data.status === 'success';
  } catch (error) {
    console.error(
      `Failed to change paper status for terminal ID ${id}:`,
      error
    );
    throw new Error(
      `Failed to change paper status for terminal ID ${id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function getPaymentQr(
  params: GetPaymentQrParams
): Promise<PaymentQrResponse> {
  const payload: PaymentQrApiPayload = {
    ceid: params.ceid,
    amount: String(params.amount),
    typePlatform: 'terminal',
  };

  if (params.ya_client_id !== undefined) {
    payload.ya_client_id = params.ya_client_id;
  }

  try {
    const response = await axiosInstance.post<PaymentQrResponse>(
      '/api/eos/paymentSBP',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to get QR-code`, error);
    throw new Error(
      `Failed to get QR-code ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
