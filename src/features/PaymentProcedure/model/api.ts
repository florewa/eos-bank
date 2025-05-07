import { axiosInstance, paymentApi } from '@/shared/api/axiosInstance.ts';

export interface PaymentItem {
  title: string;
  count: number;
  price: number;
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
      '/ceid_info',
      undefined,
      {
        params: {
          ceid: ceid,
        },
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
