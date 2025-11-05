import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    list: {}, // all categories
    selectedCategories: [],
    category: null,
  },
  reducers: {
    setCategories: (state, action) => {
      state.list = action.payload;
    },
    setCategoryAndFrontImage: (state, action) => {
      state.image = action.payload.image;
      state.category = action.payload.category;
    },
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
  },
});

export const { setCategories, setCategoryAndFrontImage, setSelectedCategories } = categorySlice.actions;
export default categorySlice.reducer;