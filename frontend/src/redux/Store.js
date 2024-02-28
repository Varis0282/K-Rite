import { loader } from "./LoaderReducer";
import { configureStore } from "@reduxjs/toolkit";
import { user } from "./UserReducer";

const store = configureStore({
  reducer: {
    loaders: loader.reducer,
    users: user.reducer
  },
});

export default store;
