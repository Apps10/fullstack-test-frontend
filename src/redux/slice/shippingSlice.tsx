import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShippingInfo } from "../../models/ShippingInfo";

interface shippingInfoState {
  shippingInfo: ShippingInfo;
}

const initialState: shippingInfoState = {
  shippingInfo: {
    email: "",
    phone: "",
    shippName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    contry: "",
  },
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    addShippingInfo(state, action: PayloadAction<ShippingInfo>) {
      state.shippingInfo = action.payload;
    },
  },
});

export const { addShippingInfo } = shippingSlice.actions;
export default shippingSlice.reducer;
