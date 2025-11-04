import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import type { PaymentMethodCard } from "../../interfaces/paymentMethodCard";
import type { CheckoutPayload } from "../../interfaces/checkout";
import type { NewOrderResponse } from "../../interfaces/newOrder";
import type { TransactionResult } from "../../interfaces/transaction";
import type { RootState } from "../store/store";

interface paymentState {
  cryptCreditCard: string,
  isPaying: boolean,
  isPayingOrder: boolean,
  paymentResponse: unknown //ToDo: cambiar
}

const initialState: paymentState = {
  cryptCreditCard: '',
  isPaying: false,
  isPayingOrder: false,
  paymentResponse: null
};

export const payOrder = createAsyncThunk<TransactionResult, NewOrderResponse, {state: RootState}>(
  "payment/process",
  async (data:NewOrderResponse, { rejectWithValue, getState }) => {
    try {
      const creditCard = getState().payment.cryptCreditCard
      const email = getState().shipping.shippingInfo.email
      
      const payload: CheckoutPayload = {
        creditCard,
        customerId: data.customerId,
        emailHolder: email,
        transactionId: data.transaction.id
      }

      const res = await axiosInstance.post("/checkout", { ...payload });
      console.log(res.data)
      return res.data;
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message);
      console.error(error);
      return rejectWithValue(null);
    }
  }
);

export const findById = createAsyncThunk(
  "payment/id",
  async (transactionId:string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/transaction/${transactionId}`);
      console.log(res.data)
      return res.data as TransactionResult;
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message);
      console.error(error);
      return rejectWithValue(null);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    addCreditCard(state, action:PayloadAction<PaymentMethodCard>) {
      state.cryptCreditCard = btoa(JSON.stringify((action.payload)))
    },
    clearPaymentResponse(state) {
      state.paymentResponse = null
    }
  },
});

export const { addCreditCard, clearPaymentResponse } = paymentSlice.actions;
export default paymentSlice.reducer;
