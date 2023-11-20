import { createSlice } from '@reduxjs/toolkit';

export const changeLogged = createSlice({
  name: 'calendar',
  initialState:{refresh:false,logged:false},
  reducers: {
    setRefresh: (state, action) => {
      state.refresh=!state.refresh;
    },
    setLogged: (state, action) => {
      state.logged=action.payload;
    },
}});

// this is for dispatch
export const { setRefresh,setLogged } = changeLogged.actions;

// this is for configureStore
export default changeLogged.reducer;