import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Obtener detalles de un producto por ID
export const fetchProductById = createAsyncThunk(
  "productDetail/fetchProductById",
  async (id) => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    return response.json();
  }
);

// Obtener productos relacionados por categoría
export const fetchRelatedProducts = createAsyncThunk(
  "productDetail/fetchRelatedProducts",
  async (category) => {
    const response = await fetch(
      `https://fakestoreapi.com/products/category/${category}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch related products");
    }
    return response.json();
  }
);

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState: {
    product: null,
    relatedProducts: [],
    status: "idle",
    relatedStatus: "idle",
    error: null,
  },
  reducers: {
    resetProductDetail: (state) => {
      state.product = null;
      state.relatedProducts = [];
      state.status = "idle";
      state.relatedStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedStatus = "loading";
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedStatus = "succeeded";
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.relatedStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { resetProductDetail } = productDetailSlice.actions;

export default productDetailSlice.reducer;
