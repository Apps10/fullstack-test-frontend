import { useAppDispatch, useAppSelector } from '../store/hook';
import {
  addCreditCard,
  clearPaymentResponse,
  findById,
  payOrder,
} from "../slice/paymentSlice";
import type { PaymentMethodCard } from '../../interfaces/paymentMethodCard';
import type { NewOrderResponse } from '../../interfaces/newOrder';

export const usePaymentStore = () => {
  const dispatch = useAppDispatch();
  const paymentResponse = useAppSelector((state) => state.payment.paymentResponse);

  const clearPaymentResponseAction = () => dispatch(clearPaymentResponse());
  const addCreditCardAction = (data:PaymentMethodCard) => dispatch(addCreditCard(data));
  const payOrderAction = (order: NewOrderResponse) => dispatch(payOrder(order));
  const findByIdAction = (transactionId: string) => dispatch(findById(transactionId));

  return {
    paymentResponse,
    addCreditCardAction,
    clearPaymentResponseAction,
    payOrderAction,
    findByIdAction
  };
};
