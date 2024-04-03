import { configureStore } from '@reduxjs/toolkit';
import authreducer from './authSlice.ts';
import userreducer from './userSlice.ts';
import productreducer from './productSlice.ts';
import purchasereducer from './purchaseSlice.ts';
import toastreducer from './toastSlice.ts';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
  key: 'auth',
  storage,
}

const persistedReducer = persistReducer(persistConfig, authreducer);


export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    users: userreducer,
    products: productreducer,
    purchases: purchasereducer,
    toast: toastreducer
  }, 
  middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch