export interface DebtInfo {
  ceid: string;
  account_id: string;
  name: string;
  debt_fnc_amount: string;
  debt_fnc_balance: string;
  contract_number: string;
  contract_date: string;
  bank_name: string;
  executory_process: string;
}

export interface PaymentInfo {
  paymentDate: string;
  paymentAmount: string;
  currency: string;
  contractNumber: string;
}

export interface BalanceInfo {
  ceid: string;
  balance_with_discount: string;
}

export interface UserStatisticsResponse {
  session_id: string;
  operation_name: string;
  status: boolean;
  result: {
    debts: DebtInfo[];
    payments: PaymentInfo[];
    balance_d: BalanceInfo[];
  };
  signature: string;
  error: string;
}

// types.ts

export interface UserStockItem {
  start_discount_date: string;
  end_discount_date: string;
  amount: string;
  discount: string;
  discount_prc: string;
  discount_jnl_id: string;
  discount_status: string;
  discount_name: string;
  promo: string;
  discount_type: string;
  discount_type_name: string;
  contract_number: string;
}

export interface UserStockResponse {
  session_id: string;
  operation_name: string;
  status: boolean;
  result: UserStockItem[];
  signature: string;
  error: string;
}
