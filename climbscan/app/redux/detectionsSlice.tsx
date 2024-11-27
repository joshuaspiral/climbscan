import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DetectionState {
  detections: Array<{ bounding_box: number[], class_id: number, confidence: number }>;
}

const initialState: DetectionState = {
  detections: [],
};

const detectionsSlice = createSlice({
  name: 'detections',
  initialState,
  reducers: {
    setDetections: (state, action: PayloadAction<Array<{ bounding_box: number[], class_id: number, confidence: number }>>) => {
      state.detections = action.payload;
    },
    clearDetections: (state) => {
      state.detections = [];
    },
  },
});

export const { setDetections, clearDetections } = detectionsSlice.actions;

export default detectionsSlice.reducer;

