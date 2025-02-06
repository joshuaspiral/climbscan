import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RouteHold {
  index: number;
}

interface RouteState {
  selectedHolds: RouteHold[];
}

const initialState: RouteState = {
  selectedHolds: [],
};

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    selectHold: (state, action: PayloadAction<RouteHold>) => {
      if (!state.selectedHolds.some(hold => hold.index === action.payload.index)) {
        state.selectedHolds.push(action.payload);
      }
    },
    deselectHold: (state, action: PayloadAction<RouteHold>) => {
      state.selectedHolds = state.selectedHolds.filter(hold => hold.index !== action.payload.index);
    },
    clearSelectedHolds: (state) => {
      state.selectedHolds = [];
    },
  },
});

export const { selectHold, deselectHold, clearSelectedHolds } = routesSlice.actions;
export default routesSlice.reducer;
