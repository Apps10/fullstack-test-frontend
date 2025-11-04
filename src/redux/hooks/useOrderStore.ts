
import { useAppDispatch, useAppSelector } from '../store/hook';
import { 
  addSelectedProduct,
  clearSelectedProduct,
  decreaseSelectedQuantityProduct,
  increaseSelectedQuantityProduct,
  newOrder,
  removeSelectedProduct
} from "../slice/orderSlice";
import type { SelectedProduct } from '../../models/selectedProduct';

export const useOrderStore = () => {
  const dispatch = useAppDispatch();

  const productsSelected = useAppSelector((state) => state.order.productsSelected);
  const clearSelectedProductAction = () => dispatch(clearSelectedProduct())
  const addSelectedProductAction = (data:SelectedProduct) => dispatch(addSelectedProduct(data))
  const decreaseSelectedQuantityProductAction = (data:SelectedProduct) => dispatch(decreaseSelectedQuantityProduct(data))
  const increaseSelectedQuantityProductAction = (data:SelectedProduct) => dispatch(increaseSelectedQuantityProduct(data))
  const removeSelectedProductAction = (data:SelectedProduct) => dispatch(removeSelectedProduct(data))
  const newOrderAction = (orderId:string) => dispatch(newOrder(orderId))
  
   return {
    productsSelected,
    
    clearSelectedProductAction,
    addSelectedProductAction,
    decreaseSelectedQuantityProductAction,
    increaseSelectedQuantityProductAction,
    removeSelectedProductAction,
    newOrderAction
  };
};