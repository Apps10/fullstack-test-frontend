import type { OrderItem } from "../models/OrderItem";

export interface NewOrderResponse {
  orderId:       string;
  customerId:    string;
  transaction:   NewOrderTransactionResponse;
}

export interface NewOrderTransactionResponse {
  totalAmount:   number;
  payerName:     string;
  paymentStatus: string;
  orderId:       string;
  id:            string
}



export interface NewOrderPayload {
  orderId?:      string
  customerId?:   string
  orderItems:     NewOrderOrderItemPayload[];
  delivery:      NewOrderDeliveryPayload;
}

export interface NewOrderDeliveryPayload {
  name:       string;
  email:      string;
  address:    string;
  phone:      string;
}

export type NewOrderOrderItemPayload = Omit<OrderItem, 'id'>