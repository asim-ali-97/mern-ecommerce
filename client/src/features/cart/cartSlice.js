import { createSlice } from "@reduxjs/toolkit";

const cartFromStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "Stripe" };

const addDecimals = (num) => Math.round(num * 100) / 100;

const calcPrices = (items) => {
  const itemsPrice = addDecimals(
    items.reduce((a, i) => a + i.price * i.qty, 0),
  );
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = addDecimals(itemsPrice * 0.15);
  const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: cartFromStorage,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exists = state.cartItems.find((i) => i._id === item._id);
      if (exists) {
        state.cartItems = state.cartItems.map((i) =>
          i._id === exists._id ? item : i,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      Object.assign(state, calcPrices(state.cartItems));
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
      Object.assign(state, calcPrices(state.cartItems));
      localStorage.setItem("cart", JSON.stringify(state));
    },
    updateCartQty: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((i) =>
        i._id === id ? { ...i, qty } : i,
      );
      Object.assign(state, calcPrices(state.cartItems));
      localStorage.setItem("cart", JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQty,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
