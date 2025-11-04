import { useAppDispatch, useAppSelector } from '../store/hook';
import { findProducts, updateStockProductSold,  } from "../slice/productSlice";
import type { SelectedProduct } from '../../models/selectedProduct';

export const useProductStore = () => {
  const dispatch = useAppDispatch();

  const products =  useAppSelector((state) => state.product.products);
  const findProductsAction = () => dispatch(findProducts())
  const updateStockProductSoldAction = (data:SelectedProduct[]) => dispatch(updateStockProductSold(data))

   return {
    products,
    findProductsAction,
    updateStockProductSoldAction,
  };
};