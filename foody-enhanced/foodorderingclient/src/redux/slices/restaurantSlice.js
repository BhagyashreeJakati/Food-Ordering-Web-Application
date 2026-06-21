import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import StatusCode from "../../utils/StatusCode";
import {
  MOCK_RESTAURANTS,
  getMockMenuForRestaurant,
  getMockCategories,
} from "../../utils/mockData";

const initial = {
  restaurants: [],
  loading: false,
  error: null,
  status: StatusCode.IDLE,
  message: null,
  restaurant: null,
  category: [],
  restaurantFoods: [],
};

export const fetchResturants = createAsyncThunk(
  "restaurants/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/restaurants");
      const list = res.data?.payload;
      if (!list || list.length === 0) return { payload: MOCK_RESTAURANTS };
      return res.data;
    } catch {
      return { payload: MOCK_RESTAURANTS };
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  "restaurants/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/restaurants/${id}`);
      if (res.data?.payload) return res.data;
      throw new Error("empty");
    } catch {
      const found = MOCK_RESTAURANTS.find((r) => String(r.id) === String(id));
      return { payload: found || MOCK_RESTAURANTS[0] };
    }
  }
);

export const fetchRestaurantFoods = createAsyncThunk(
  "restaurants/fetchFoods",
  async (req, { rejectWithValue }) => {
    try {
      const { restaurantId, vegetarian, seasonal, nonveg, foodCategory } = req;
      let url = `/foods/restaurant/${restaurantId}?vegetarian=${!!vegetarian}&seasonal=${!!seasonal}&nonveg=${!!nonveg}`;
      if (foodCategory && foodCategory !== "all") url += `&food_category=${foodCategory}`;
      const res = await api.get(url);
      if (res.data?.payload?.length) return res.data;
      throw new Error("empty");
    } catch {
      const foods = getMockMenuForRestaurant(req.restaurantId);
      let filtered = [...foods];
      if (req.vegetarian) filtered = filtered.filter((f) => f.vegetarian);
      if (req.nonveg) filtered = filtered.filter((f) => !f.vegetarian);
      if (req.seasonal) filtered = filtered.filter((f) => f.seasonal);
      return { payload: filtered };
    }
  }
);

export const searchRestaurants = createAsyncThunk(
  "restaurants/search",
  async (keyword, { rejectWithValue }) => {
    try {
      return (await api.get(`/restaurants/search?keyword=${keyword}`)).data;
    } catch {
      const kw = keyword.toLowerCase();
      const results = MOCK_RESTAURANTS.filter((r) =>
        [r.name, r.description, r.cuisineType].join(" ").toLowerCase().includes(kw)
      );
      return { payload: results };
    }
  }
);

export const getRestaurantCategory = createAsyncThunk(
  "restaurants/getCategory",
  async (id, { rejectWithValue }) => {
    try {
      return (await api.get(`/category/restaurant/${id}`)).data;
    } catch {
      return { payload: getMockCategories() };
    }
  }
);

const slice = createSlice({
  name: "restaurants",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResturants.pending, (s) => { s.loading = true; s.error = null; s.status = StatusCode.LOADING; })
      .addCase(fetchResturants.fulfilled, (s, a) => { s.loading = false; s.restaurants = a.payload.payload; s.status = StatusCode.SUCCESS; })
      .addCase(fetchResturants.rejected, (s, a) => { s.loading = false; s.error = a.payload; s.status = StatusCode.FAILED; })
      .addCase(fetchRestaurantById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchRestaurantById.fulfilled, (s, a) => { s.loading = false; s.restaurant = a.payload.payload; })
      .addCase(fetchRestaurantById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchRestaurantFoods.pending, (s) => { s.loading = true; })
      .addCase(fetchRestaurantFoods.fulfilled, (s, a) => { s.loading = false; s.restaurantFoods = a.payload.payload; })
      .addCase(fetchRestaurantFoods.rejected, (s) => { s.loading = false; })
      .addCase(searchRestaurants.fulfilled, (s, a) => { s.restaurants = a.payload.payload || []; })
      .addCase(getRestaurantCategory.fulfilled, (s, a) => { s.category = a.payload.payload || []; });
  },
});

export default slice.reducer;
