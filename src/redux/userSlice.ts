import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHandler } from "./handleFetch.ts";
import { apiUrl } from "../constants.ts";

export interface User {
   guid: string;
   name: string;
   type: number;
   username: string;
  
}

interface InitialState {
   userList: Array<User>
}

const initialState: InitialState = { userList: [] };
   

export const getUsers = createAsyncThunk("getUsers", async (_, state : any) => {
  return fetchHandler(state,`${apiUrl}/users/list`,"GET", {} );
})

export const addUser = createAsyncThunk("addUser", async(body: object, state: any) => {
   return fetchHandler(state, `${apiUrl}/users/add`, "POST", body)
} )

export const deleteUser =  createAsyncThunk("deleteUser", async (guid: string, state : any) => {
   return fetchHandler(state,`${apiUrl}/users/remove`,"DELETE", {guid} );
 })


export const userSlice = createSlice({
   name: 'users',
   initialState,

   reducers: {

   },

   extraReducers: (builder) => {
      builder
         .addCase(getUsers.fulfilled, (state, action) => {
            state.userList = action?.payload?.data?.data;
         })
       
   },

})


export default userSlice.reducer;
