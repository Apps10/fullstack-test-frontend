
export interface PrimitiveOrderItem {
  productId: number,
  quantity: number
  price: number
}

export interface OrderItem extends PrimitiveOrderItem {
  id?: string
}