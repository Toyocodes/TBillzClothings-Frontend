
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../lib/axios";

// Thunks
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`/shop/wishlist/get/${userId}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || "Error fetching wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const res = await axios.post("/shop/wishlist/add", { userId, productId });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || "Error adding to wishlist");
    }
  }
);

// export const removeFromWishlist = createAsyncThunk(
//   "wishlist/removeFromWishlist",
//   async ({ userId, productId }, thunkAPI) => {
//     try {
//       // await axios.delete("/shop/wishlist/delete", { userId, productId });
//        await axios.delete(`/shop/wishlist/delete/${userId}/${productId}`);
//       return productId;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data.message || "Error removing from wishlist");
//     }
//   }
// );

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ userId, productId }) => {
    const res = await axios.delete(`/shop/wishlist/delete/${userId}/${productId}`);
    return productId;
  }
);


const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(addToWishlist.fulfilled, (state, action) => {
      //   // state.items.push({ _id: action.payload._id, product: action.payload.productId });
      //   state.items.push(action.payload);

      // })
      .addCase(addToWishlist.fulfilled, (state, action) => {
  const normalizedItem = {
    _id: action.payload._id,
    product: action.payload.productId, // normalize key to match rest of frontend
  };
  state.items.push(normalizedItem);
})

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.product._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
