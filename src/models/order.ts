import type { OrderItem } from "./OrderItem"

export const OrderStatus = {
  CANCELLED: 'CANCELLED',
  DELIVERED: 'DELIVERED',
  PENDING: 'PENDING',
  PAID: 'PAID',
} as const;

export const OrderStatusList = [
  OrderStatus.CANCELLED,
  OrderStatus.DELIVERED,
  OrderStatus.PENDING
]

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface Order {
  id:             string             
  paidAt?:        Date
 
  customerId?:    string
  status:         OrderStatus

  orderItems:      OrderItem[]
  totalAmount?:   number
  createdAt?:     Date,      
  updatedAt?:     Date,   
}
