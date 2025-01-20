import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Detection {
  bounding_box: number[];
  confidence: number;
}

interface DetectionState {
  photoUri: string | null;
  detections: Detection[];
  photoDimensions: { width: number; height: number } | null;
}

const initialState: DetectionState = {
  photoUri: null,
  detections: [],
  photoDimensions: null,
};

const detectionsSlice = createSlice({
  name: 'detections',
  initialState,
  reducers: {
    setPhotoUri: (state, action: PayloadAction<string>) => {
      state.photoUri = action.payload;
    },
    setDetections: (state, action: PayloadAction<Detection[]>) => {
      state.detections = action.payload;
    },
    setPhotoDimensions: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.photoDimensions = action.payload;
    },
    clearDetections: (state) => {
      state.detections = [];
      state.photoUri = null;
      state.photoDimensions = null;
    },
  },
});

export const { setPhotoUri, setDetections, setPhotoDimensions, clearDetections } = detectionsSlice.actions;

export default detectionsSlice.reducer;