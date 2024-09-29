// redux/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  products: [],
  selectedCategory: null,
  searchTerm: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    clearProducts(state) {
      state.products = [];
    },
  },
});

export const {
  setCategories,
  setProducts,
  setSelectedCategory,
  setSearchTerm,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;
