import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHandler } from "./handleFetch.ts";
import { apiUrl } from "../constants.ts";

export interface ProductItem {
   guid: string;
   name: string;
   details: string;
   image: string;
   count: number;
   rating: number;
   imageName?: string;
}

interface InitialState {
   productList: Array<ProductItem>
}

const initialState: InitialState = { productList: [] };


export const getProducts = createAsyncThunk("getProducts", async (_, state: any) => {
   return fetchHandler(state, `${apiUrl}/products/list`, "GET", {});
})

export const deleteProduct = createAsyncThunk("deleteProduct", async (guid: string, state: any) => {
   return fetchHandler(state, `${apiUrl}/products/remove`, "DELETE", { guid })
})

export const addProduct = createAsyncThunk("addProduct", async (body: object, state: any) => {
   return fetchHandler(state, `${apiUrl}/products/add`, "POST", body)
})

export const editProduct = createAsyncThunk("editProduct", async (body: object, state: any) => {
   return fetchHandler(state, `${apiUrl}/products/edit`, "POST", body)
})


export const productSlice = createSlice({
   name: 'products',
   initialState,
   reducers: {

   },

   extraReducers: (builder) => {
      builder
         .addCase(getProducts.fulfilled, (state, action) => {
            state.productList = action?.payload?.data?.data;

         })

   },

})


export default productSlice.reducer;
