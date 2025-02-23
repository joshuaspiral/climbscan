import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RouteHold {
  index: number;
}

interface RouteState {
  startHolds: number[];
  endHolds: number[];
  selectedHolds: RouteHold[];
}

const initialState: RouteState = {
  startHolds: [],
  endHolds: [],
  selectedHolds: [],
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
    clearSelectedHolds: (state) => {
      state.selectedHolds = [];
    },
  },
});

export const { selectHold, deselectHold, saveRoute, clearSelectedHolds } = routesSlice.actions;

export default routesSlice.reducer;