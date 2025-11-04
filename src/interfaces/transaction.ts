export interface TransactionResult {
  ok:          boolean;
  Transaction: Transaction;
}

export interface Transaction {
  id:                 string;
  payerName:          string;
  description:        string;
  payerTransactionId: string;
  paymentStatus:      string;
  totalAmount:        number;
  metadata:           null;
  orderId:            string;
  paidAt:             null;
  createdAt:          Date;
  updatedAt:          Date;
}
