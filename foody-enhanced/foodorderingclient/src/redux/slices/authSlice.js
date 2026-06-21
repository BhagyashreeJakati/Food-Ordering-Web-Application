import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import StatusCode from "../../utils/StatusCode";

export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const r = await api.post("/user/register", userData);
    const { jwt, email, userName, role } = r.data.payload;
    localStorage.setItem("jwtToken", jwt);
    return { token: jwt, user: { email, userName, role }, message: r.data.message };
  } catch (err) {
    const message = err.response?.data?.message || err.message || "Registration failed. Please try again.";
    return rejectWithValue({ message });
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const r = await api.post("/user/login", credentials);
    const { jwt, email, userName, role } = r.data.payload;
    localStorage.setItem("jwtToken", jwt);
    return { token: jwt, user: { email, userName, role }, message: r.data.message };
  } catch (err) {
    const message = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
    return rejectWithValue({ message });
  }
});

// userProfile NEVER touches loginStatus — has its own loading flag only
export const userProfile = createAsyncThunk("auth/userProfile", async (_, { rejectWithValue }) => {
  try {
    const r = await api.get("/user/profile");
    return r.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load profile");
  }
});

export const addToFavorite = createAsyncThunk("auth/addToFavorite", async (restaurantId) => {
  try {
    const r = await api.put(`/restaurants/${restaurantId}/add-favorites`);
    return r.data;
  } catch {
    return { payload: { id: restaurantId }, message: "Favourites updated" };
  }
});

const initialState = {
  message: null,
  user: null,
  favorites: [],
  token: localStorage.getItem("jwtToken") || null,
  loading: false,
  profileLoading: false,   // separate — never pollutes loginStatus
  error: null,
  loginStatus: StatusCode.IDLE,  // renamed from "status" — only login/register touch this
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.favorites = [];
      state.loginStatus = StatusCode.IDLE;
      localStorage.removeItem("jwtToken");
    },
    resetState: (state) => {
      state.loginStatus = StatusCode.IDLE;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── register — only touches loginStatus ──
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; s.loginStatus = StatusCode.LOADING; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.message = a.payload.message; s.token = a.payload.token; s.loginStatus = StatusCode.SUCCESS; })
      .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; s.loginStatus = StatusCode.FAILED; })
      // ── login — only touches loginStatus ──
      .addCase(loginUser.pending,      (s) => { s.loading = true; s.error = null; s.loginStatus = StatusCode.LOADING; })
      .addCase(loginUser.fulfilled,    (s, a) => { s.loading = false; s.message = a.payload.message; s.user = a.payload.user; s.token = a.payload.token; s.loginStatus = StatusCode.SUCCESS; })
      .addCase(loginUser.rejected,     (s, a) => { s.loading = false; s.error = a.payload; s.loginStatus = StatusCode.FAILED; })
      // ── userProfile — NEVER touches loginStatus ──
      .addCase(userProfile.pending,    (s) => { s.profileLoading = true; })
      .addCase(userProfile.fulfilled,  (s, a) => { s.profileLoading = false; s.user = a.payload.payload; s.favorites = a.payload.payload?.favorites || []; })
      .addCase(userProfile.rejected,   (s) => { s.profileLoading = false; })
      // ── favourites ──
      .addCase(addToFavorite.fulfilled, (s, a) => {
        const fav = a.payload.payload;
        if (fav && s.favorites.some(i => i.id === fav.id)) {
          s.favorites = s.favorites.filter(i => i.id !== fav.id);
        } else if (fav) {
          s.favorites = [...s.favorites, fav];
        }
        s.message = a.payload.message;
      });
  },
});

export const { logout, resetState } = authSlice.actions;
export default authSlice.reducer;
