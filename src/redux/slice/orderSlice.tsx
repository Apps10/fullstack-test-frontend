import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import type {
  NewOrderPayload,
  NewOrderResponse,
} from "../../interfaces/newOrder";
import type { ShippingInfo } from "../../models/ShippingInfo";
import type { PrimitiveOrderItem } from "../../models/OrderItem";
import type { SelectedProduct } from "../../models/selectedProduct";
import type { RootState } from "../store/store";

interface orderState {
  productsSelected: SelectedProduct[];
  confirmOrderProduct: boolean;
}

const initialState: orderState = {
  productsSelected: [],
  confirmOrderProduct: false,
};

export const newOrder = createAsyncThunk<NewOrderResponse, string, {state: RootState}>(
  "order/new",
  async (orderId: string, { rejectWithValue, getState }) => {
    try {
      const selectedP: SelectedProduct[] = getState().order.productsSelected;
      const orderItems: PrimitiveOrderItem[] = selectedP.map(sp=>({...sp, id: null, productId: sp.id}))
      const {
        address: shippingAddress,
        city,
        contry,
        email,
        phone,
        postalCode,
        shippName,
        state,
      }: ShippingInfo = getState().shipping.shippingInfo;
      const address = `${city},${state} ${shippingAddress} ${postalCode} ${contry}`;

      const payload: NewOrderPayload = {
        orderId,
        orderItems,
        delivery: {
          address,
          email,
          name: shippName,
          phone,
        },
      };
      const result = await axiosInstance.post("/order", { ...payload })
      return result.data as NewOrderResponse;
    } catch (error) {
      const { message } = error.response.data;
      toast.error(message);
      console.error(error);
      return rejectWithValue(null);
    }
  }
);

const findIndexByIdOrProductId = (arr: SelectedProduct[], id: number) => {
  console.log(JSON.parse(JSON.stringify(arr)));
  return arr.findIndex((p) => p.id === id || (p as SelectedProduct).id === id);
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addSelectedProduct(state, action: PayloadAction<SelectedProduct>) {
      const item = action.payload;
      const idx = findIndexByIdOrProductId(state.productsSelected, item.id);

      if (idx !== -1) {
        const existing = state.productsSelected[idx];
        const newQty = existing.quantity + item.quantity;
        if (typeof existing.stock === "number") {
          existing.quantity = Math.min(newQty, existing.stock);
        } else if (typeof item.stock === "number") {
          existing.quantity = Math.min(newQty, item.stock);
        } else {
          existing.quantity = newQty;
        }
        state.productsSelected[idx] = existing;
      } else {
        const toPush: SelectedProduct = { ...item };
        if (typeof toPush.quantity !== "number" || toPush.quantity < 1) {
          toPush.quantity = 1;
        }
        if (typeof toPush.stock === "number") {
          toPush.quantity = Math.min(toPush.quantity, toPush.stock);
        }
        state.productsSelected.push(toPush);
      }
    },

    increaseSelectedQuantityProduct(
      state,
      action: PayloadAction<SelectedProduct>
    ) {
      const { id } = action.payload;
      const amount = 1;
      const idx = findIndexByIdOrProductId(state.productsSelected, id);
      if (idx === -1) return;

      const item = state.productsSelected[idx];
      const desired = item.quantity + amount;
      if (typeof item.stock === "number") {
        item.quantity = Math.min(desired, item.stock);
      } else {
        item.quantity = desired;
      }
      state.productsSelected[idx] = item;
    },

    decreaseSelectedQuantityProduct(
      state,
      action: PayloadAction<SelectedProduct>
    ) {
      const amount = 1;
      const { id } = action.payload;
      const idx = findIndexByIdOrProductId(state.productsSelected, id);
      if (idx === -1) return;

      const item = state.productsSelected[idx];
      item.quantity = Math.max(1, item.quantity - amount);
      state.productsSelected[idx] = item;
    },

    removeSelectedProduct(state, action: PayloadAction<SelectedProduct>) {
      const { id } = action.payload;
      const itemsFiltered = state.productsSelected.filter((p) => p.id !== id);

      state.productsSelected = itemsFiltered;
    },
    clearSelectedProduct(state) {
      state.productsSelected = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newOrder.pending, () => {})
      .addCase(newOrder.fulfilled, (state) => {
        state.confirmOrderProduct = false;
      })
      .addCase(newOrder.rejected, (state) => {
        state.confirmOrderProduct = false;
      });
  },
});

export const {
  addSelectedProduct,
  decreaseSelectedQuantityProduct,
  increaseSelectedQuantityProduct,
  removeSelectedProduct,
  clearSelectedProduct
} = orderSlice.actions;
export default orderSlice.reducer;
