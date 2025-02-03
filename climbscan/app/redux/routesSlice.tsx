import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RouteHold {
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
    selectHold: (state, action) => {
      if (!state.selectedHolds.includes(action.payload)) {
        state.selectedHolds.push(action.payload);
      }
    },
    deselectHold: (state, action) => {
      state.selectedHolds = state.selectedHolds.filter(
        id => id !== action.payload
      );
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