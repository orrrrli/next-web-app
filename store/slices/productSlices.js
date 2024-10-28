import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    return response.json();
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category) => {
    const response = await fetch(
      `https://fakestoreapi.com/products/category/${category}`
    );
    return response.json();
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    filteredItems: [],
    status: "idle",
    categoryStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchProductsByCategory.pending, (state) => {
        state.categoryStatus = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categoryStatus = "succeeded";
        state.filteredItems = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.categoryStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;