import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategories: [],
  selectedColors: [],
  selectedFabrics: [],
  checkedRatings: [],
  selectedCombos: [],
  selectedGenders: [],
  selectedPrice: [],
  selectedDiscounts: [],
  selectedSize: [],
  address: [],
  ratingAndId: { rating: 0, productId: "" },
  itemsAndPrice: {
    items: 0,
    price: 0,
    discount: 0,
  },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedCategories: (state, action) => {
      state.selectedCategories = action.payload;
    },
    setSelectedColors: (state, action) => {
      state.selectedColors = action.payload;
    },
    setSelectedFabrics: (state, action) => {
      state.selectedFabrics = action.payload;
    },
    setCheckedRatings: (state, action) => {
      state.checkedRatings = action.payload;
    },
    setSelectedCombos: (state, action) => {
      state.selectedCombos = action.payload;
    },
    setSelectedGenders: (state, action) => {
      state.selectedGenders = action.payload;
    },
    setSelectedPrice: (state, action) => {
      state.selectedPrice = action.payload;
    },
    setSelectedDiscounts: (state, action) => {
      state.selectedDiscounts = action.payload;
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    setItemsAndPrice: (state, action) => {
      state.itemsAndPrice = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setRatingAndId: (state, action) => {
      state.ratingAndId = action.payload;
    },
  },
});

export const {
  setSelectedCategories,
  setSelectedColors,
  setSelectedFabrics,
  setCheckedRatings,
  setSelectedCombos,
  setSelectedGenders,
  setSelectedPrice,
  setSelectedDiscounts,
  setSelectedSize,
  setItemsAndPrice,
  setAddress,
  setRatingAndId,
} = filterSlice.actions;
export default filterSlice.reducer;
