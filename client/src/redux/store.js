import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import messageReducer from "./slices/messageSlice";
import farmerReducer from "./slices/farmerSlice";
import userReducer from "./slices/userSlice";
// ✅ NEW: Add farmConnect reducer
import farmConnectReducer from "./slices/farmConnectSlice";

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
    // ✅ NEW: Add farmConnect to your existing reducers
    farmConnect: farmConnectReducer,
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
