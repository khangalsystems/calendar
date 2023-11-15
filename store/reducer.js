import { createSlice } from '@reduxjs/toolkit';

export const changeLogged = createSlice({
  name: 'calendar',
  initialState:{marks:{}},
  reducers: {
    setMarks: (state, action) => {
      state.marks=action.payload;
    },
}});

// this is for dispatch
export const { setMarks} = changeLogged.actions;

// this is for configureStore
export default changeLogged.reducer;