import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const FAKE_API_URL = "https://fakestoreapi.com/products";

// Acción para agregar un producto al carrito
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { rejectWithValue }) => {
      try {
          const token = localStorage.getItem('token');

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

// Acción para obtener los items del carrito con datos detallados
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
      try {
          const token = localStorage.getItem('token');
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

          const { items } = await response.json();

          // Obtener detalles del producto desde la FakeAPI
          const detailedItems = await Promise.all(items.map(async (item) => {
              const productResponse = await fetch(`${FAKE_API_URL}/${item.productId}`);
              if (!productResponse.ok) throw new Error("Error al obtener detalles del producto desde FakeAPI");
              
              const productData = await productResponse.json();
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

// Acción para eliminar un producto del carrito en la base de datos
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/cart/item/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || "Error al eliminar el producto del carrito");
            }

            return await response.json(); // Devolver los items actualizados
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            return rejectWithValue("No se pudo eliminar el producto del carrito.");
        }
    }
);

// Acción para incrementar la cantidad de un producto en el carrito en la base de datos
export const incrementQuantityAsync = createAsyncThunk(
    'cart/incrementQuantity',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const item = getState().cart.items.find(item => item.productId === productId);
            
            const response = await fetch(`/api/cart/item/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: item.quantity + 1 }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || "Error al incrementar la cantidad del producto");
            }

            return await response.json();
        } catch (error) {
            console.error("Error al incrementar la cantidad:", error);
            return rejectWithValue("No se pudo incrementar la cantidad.");
        }
    }
);

// Acción para disminuir la cantidad de un producto en el carrito en la base de datos
export const decrementQuantityAsync = createAsyncThunk(
    'cart/decrementQuantity',
    async (productId, { getState, rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const item = getState().cart.items.find(item => item.productId === productId);

            if (item.quantity <= 1) return rejectWithValue("La cantidad no puede ser menor que 1.");

            const response = await fetch(`/api/cart/item/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: item.quantity - 1 }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || "Error al disminuir la cantidad del producto");
            }

            return await response.json();
        } catch (error) {
            console.error("Error al disminuir la cantidad:", error);
            return rejectWithValue("No se pudo disminuir la cantidad.");
        }
    }
);

// Slice de Redux para el carrito
export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.fulfilled, (state, action) => {
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
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.productId !== action.meta.arg);
            })
            .addCase(incrementQuantityAsync.fulfilled, (state, action) => {
                const updatedItem = state.items.find(item => item.productId === action.meta.arg);
                if (updatedItem) updatedItem.quantity += 1;
            })
            .addCase(decrementQuantityAsync.fulfilled, (state, action) => {
                const updatedItem = state.items.find(item => item.productId === action.meta.arg);
                if (updatedItem && updatedItem.quantity > 1) updatedItem.quantity -= 1;
            });
    }
});

export default cartSlice.reducer;
