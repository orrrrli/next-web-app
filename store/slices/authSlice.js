import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  isAuthenticated: false,
  username: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const token = action.payload;
      const decodedToken = jwtDecode(token);
      state.isAuthenticated = true;
      state.username = decodedToken.username;
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = "";
      localStorage.removeItem("token");
    },
    checkAuth: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        state.isAuthenticated = true;
        state.username = decodedToken.username;
      }
    },
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
