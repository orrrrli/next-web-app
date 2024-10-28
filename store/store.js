import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "@/store/slices/productSlices";
import productDetailReducer from "@/store/slices/productDetailSlice";
import cartReducer from "@/store/slices/cartSlices";
import categoriesReducer from "@/store/slices/categorySlices";
import authReducer from "@/store/slices/authSlice";


const store = configureStore({
  reducer: {
    products: productsReducer,
    productDetail: productDetailReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    auth: authReducer,
  },
});

export default store;
