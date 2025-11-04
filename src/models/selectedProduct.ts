import type { Product } from "./Products";

export interface SelectedProduct extends Product {
  quantity: number
}