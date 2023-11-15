import { configureStore } from "@reduxjs/toolkit";
import storiesReducer from "./reducer";

const store = configureStore({
  reducer: { data: storiesReducer },
});

export default store;