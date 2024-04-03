import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHandler } from "./handleFetch.ts";
import { ProductItem } from "./productSlice.ts";
import { apiUrl } from "../constants.ts";


export interface PurchaseItem {
   guid: string;
   count: number;
   status?: number;
   productDetails: ProductItem
  
}

interface InitialState {
   purchaseList: Array<PurchaseItem>
}

const initialState: InitialState = { purchaseList: [] };
   

export const getPurchases = createAsyncThunk("getPurchases", async (_, state : any) => {
  return fetchHandler(state,`${apiUrl}/purchases/list`,"GET", {} );
})

export const addPurchase = createAsyncThunk("addPurchase", async(body: object, state: any) => {
   return fetchHandler(state,`${apiUrl}/purchases/add`,"POST", body)
})

export const deletePurchase = createAsyncThunk("deletePurchase", async(guid: string, state: any) => {
   return fetchHandler(state,`${apiUrl}/purchases/remove`,"DELETE", {guid})
})

export const purchaseSlice = createSlice({
   name: 'purchases',
   initialState,

   reducers: {

   },

   extraReducers: (builder) => {
      builder
         .addCase(getPurchases.fulfilled, (state, action) => {
            state.purchaseList = action?.payload?.data?.data;
         })

   }, 

})


export default purchaseSlice.reducer;
