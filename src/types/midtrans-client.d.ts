declare module "midtrans-client" {
  interface SnapParams {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    credit_card?: { secure: boolean };
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    };
    enabled_payments?: string[];
    callbacks?: {
      finish?: string;
    };
  }

  interface SnapTransactionResult {
    token: string;
    redirect_url: string;
  }

  interface TransactionStatusResult {
    order_id: string;
    transaction_status: string;
    fraud_status: string;
    payment_type: string;
    gross_amount: string;
    status_code: string;
    transaction_id: string;
    status_message?: string;
    [key: string]: any;
  }

  interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface CoreApiConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  export class Snap {
    constructor(config: SnapConfig);
    createTransaction(params: SnapParams): Promise<SnapTransactionResult>;
  }

  export class CoreApi {
    constructor(config: CoreApiConfig);
    transaction: {
      status(orderId: string): Promise<TransactionStatusResult>;
    };
  }
}
