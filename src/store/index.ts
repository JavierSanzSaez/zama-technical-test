import { configureStore } from '@reduxjs/toolkit';
import featureFlagsReducer from './featureFlagsSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    featureFlags: featureFlagsReducer,
  },
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the store
export default store;