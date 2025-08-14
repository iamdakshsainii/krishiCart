import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import messageReducer from "./slices/messageSlice";
import farmerReducer from "./slices/farmerSlice";
import profileReducer from './slices/profileSlice';
import userReducer from "./slices/userSlice";
import farmConnectReducer from "./slices/farmConnectSlice";
import newsReducer from "./slices/newsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
    orders: orderReducer,
    messages: messageReducer,
    farmers: farmerReducer,
    users: userReducer,
    profile: profileReducer,
    farmConnect: farmConnectReducer,
    news: newsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store;
