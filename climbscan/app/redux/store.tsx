import { configureStore } from '@reduxjs/toolkit';
import detectionsReducer from './detectionsSlice';
import routesReducer from './routesSlice';

const store = configureStore({
  reducer: {
    detections: detectionsReducer,
    routes: routesReducer,
  },
});

export default store;

