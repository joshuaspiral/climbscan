import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RouteState {
  selectedHolds: number[];  // Array of indexes of selected holds
}

const initialState: RouteState = {
  selectedHolds: [],
};

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    selectHold: (state, action: PayloadAction<number>) => {
      if (!state.selectedHolds.includes(action.payload)) {
        state.selectedHolds.push(action.payload);
      }
    },
    deselectHold: (state, action: PayloadAction<number>) => {
      state.selectedHolds = state.selectedHolds.filter(index => index !== action.payload);
    },
    clearRoute: (state) => {
      state.selectedHolds = [];
    },
    saveRoute: (state) => {
    // wip
    },
  },
});

export const { selectHold, deselectHold, clearRoute, saveRoute } = routesSlice.actions;

export default routesSlice.reducer;

