import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    return serializedCart ? JSON.parse(serializedCart) : [];
  } catch (error) {
    console.error("Error al cargar el carrito de localStorage:", error);
    return [];
  }
};

const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error al guardar el carrito en localStorage:", error);
  }
};

const initialState = {
  items: loadCartFromLocalStorage(),
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId // Cambiar `id` a `productId`
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToLocalStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload); // Cambiar `id` a `productId`
      saveCartToLocalStorage(state.items);
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.productId === action.payload);
      if (item) {
          console.log(`Incrementando cantidad de ${item.productId}, cantidad actual: ${item.quantity}`);
          item.quantity += 1;
          saveCartToLocalStorage(state.items);
      }
    },
    decrementQuantity: (state, action) => {
        const item = state.items.find((item) => item.productId === action.payload);
        if (item && item.quantity > 1) {
            console.log(`Decrementando cantidad de ${item.productId}, cantidad actual: ${item.quantity}`);
            item.quantity -= 1;
            saveCartToLocalStorage(state.items);
        }
    },
  
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  toggleCart,
  closeCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
