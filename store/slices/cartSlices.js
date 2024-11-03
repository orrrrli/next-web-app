// store/slices/cartSlices.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const FAKE_API_URL = "https://fakestoreapi.com/products";


export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { rejectWithValue }) => {
      try {
          const token = localStorage.getItem('token'); // Asegúrate de que el token esté en localStorage

          const response = await fetch('/api/cart', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                  productId: product.id,
                  quantity: 1,
                  price: product.price,
              }),
          });

          if (!response.ok) {
              const errorData = await response.json();
              return rejectWithValue(errorData.error || "Error al agregar el producto al carrito");
          }

          return await response.json();
      } catch (error) {
          console.error("Error al agregar el producto al carrito:", error);
          return rejectWithValue("No se pudo agregar el producto al carrito. Por favor, inténtalo de nuevo.");
      }
  }
);


export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
      try {
          const token = localStorage.getItem('token');

          // Obtener los items del carrito desde la API local
          const response = await fetch('/api/cart', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
              },
          });

          if (!response.ok) {
              const errorData = await response.json();
              return rejectWithValue(errorData.error || "Error al obtener los items del carrito");
          }

          const { items } = await response.json(); // items con productId, quantity y price

          // Realizar una petición a FakeAPI para cada productId
          const detailedItems = await Promise.all(items.map(async (item) => {
              const productResponse = await fetch(`${FAKE_API_URL}/${item.productId}`);
              
              // Comprobar si la solicitud fue exitosa
              if (!productResponse.ok) {
                  throw new Error("Error al obtener detalles del producto desde FakeAPI");
              }
              
              const productData = await productResponse.json();

              // Retornar un objeto que combine los datos de la base de datos y de la FakeAPI
              return {
                  ...item,
                  title: productData.title,
                  image: productData.image,
                  description: productData.description,
              };
          }));

          return detailedItems;
      } catch (error) {
          console.error("Error al obtener los items del carrito:", error);
          return rejectWithValue("No se pudieron obtener los items del carrito.");
      }
  }
);


export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { getState }) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: getState().cart.items.filter(item => item.productId !== productId) })
    });
    return response.json();
});

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: []
    },
    reducers: {
        incrementQuantity: (state, action) => {
            const item = state.items.find(item => item.productId === action.payload);
            if (item) {
                item.quantity++;
            }
        },
        decrementQuantity: (state, action) => {
            const item = state.items.find(item => item.productId === action.payload);
            if (item && item.quantity > 1) {
                item.quantity--;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(fetchCartItems.pending, (state) => {
              state.status = 'loading';
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
            
    }
});

export const { incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
