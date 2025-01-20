import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RouteHold {
  x: number;
  y: number;
  index: number;
}

interface RouteState {
  selectedHolds: RouteHold[];
  routes: RouteHold[][];
}

const initialState: RouteState = {
  selectedHolds: [],
  routes: [],
};

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    selectHold: (state, action: PayloadAction<number>) => {
      const hold = state.selectedHolds.find(hold => hold.index === action.payload);
      if (!hold) {
        state.selectedHolds.push({ x: 0, y: 0, index: action.payload });
      }
    },
    deselectHold: (state, action: PayloadAction<number>) => {
      state.selectedHolds = state.selectedHolds.filter(hold => hold.index !== action.payload);
    },
    saveRoute: (state) => {
      state.routes.push([...state.selectedHolds]);
      state.selectedHolds = [];
    },
    clearSelectedHolds: (state) => {
      state.selectedHolds = [];
    },
  },
});

export const { selectHold, deselectHold, saveRoute, clearSelectedHolds } = routesSlice.actions;

export default routesSlice.reducer;