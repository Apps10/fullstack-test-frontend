import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import type { Product } from "../../models/Products";
import type { SelectedProduct } from "../../models/selectedProduct";

interface InitialState {
  products: Product[];
}

const initialState: InitialState = {
  products: [],
};

export const findProducts = createAsyncThunk(
  "product",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("product");
      const { Products } = res.data as { ok: true; Products: Product[] };
      return Products.map((p) => ({ ...p, quantity: 1 }));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateStockProductSold(state, action: PayloadAction<SelectedProduct[]>) {
      const productsLocal = JSON.parse(JSON.stringify(state.products)) as Product[]
      const productUpdated = productsLocal.map(p=>{
        const productLocal = action.payload.find(ptu=> ptu.id == p.id)
          if(!productLocal) return { ...p }
          return {
            ...p,
            stock: p.stock - productLocal.quantity,
            quantity: 1
          }
      })
      state.products = productUpdated
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
  },
});

export const { updateStockProductSold } = productSlice.actions;
export default productSlice.reducer;
