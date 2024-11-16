import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalItemsCount: 0,
    totalPrice: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.product_id === action.payload.product_id &&
          (action.payload.customization
            ? item.customization === action.payload.customization
            : true)
      );
      if (existingItem) {
        existingItem.count += 1;
        existingItem.subtotal += action.payload.price;
      } else {
        state.items.push({
          ...action.payload,
          count: 1,
          subtotal: action.payload.price,
        });
      }
      const sub = state.items.map((item) => item.subtotal);
      state.totalPrice = sub.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      state.totalItemsCount = state.items.length;
    },
    Increasecount: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.product_id === action.payload.product_id &&
          (action.payload.customization
            ? item.customization === action.payload.customization
            : true)
      );
      if (existingItem) {
        existingItem.count += 1;
        existingItem.subtotal += action.payload.price;
      }
      const sub = state.items.map((item) => item.subtotal);
      state.totalPrice = sub.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    },
    Decreasecount: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.product_id === action.payload.product_id &&
          (action.payload.customization
            ? item.customization === action.payload.customization
            : true)
      );

      if (existingItem) {
        if (existingItem.count > 1) {
          existingItem.count -= 1;
          existingItem.subtotal -= action.payload.price;

          if (existingItem.count < 0) existingItem.count = 0;
          if (existingItem.subtotal < 0) existingItem.subtotal = 0;
        }
      }
      const sub = state.items.map((item) => item.subtotal);
      state.totalPrice = sub.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    },
    RemoveItem: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.product_id === action.payload.product_id &&
            (action.payload.customization
              ? item.customization === action.payload.customization
              : true)
          )
      );
      state.totalItemsCount = state.items.length;
      const sub = state.items.map((item) => item.subtotal);
      state.totalPrice = sub.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    },
    removecart: (state, action) => {
      state.totalItemsCount = 0;
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const {
  addToCart,
  Decreasecount,
  Increasecount,
  RemoveItem,
  removecart,
} = cartSlice.actions;
export default cartSlice.reducer;
