import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEV_CONFIG } from "../constants";

// Types
export type FeatureFlagKey = keyof typeof DEV_CONFIG.featureFlags;
export type FeatureFlag = (typeof DEV_CONFIG.featureFlags)[FeatureFlagKey];

interface FeatureFlagsState {
  flags: typeof DEV_CONFIG.featureFlags;
}

// Initial state - use the default flags from constants
const initialState: FeatureFlagsState = {
  flags: { ...DEV_CONFIG.featureFlags },
};

// Create the slice
const featureFlagsSlice = createSlice({
  name: "featureFlags",
  initialState,
  reducers: {
    toggleFeatureFlag: (
      state,
      action: PayloadAction<{ flagKey: FeatureFlagKey; enabled: boolean }>
    ) => {
      const { flagKey, enabled } = action.payload;
      if (state.flags[flagKey]) {
        (state.flags[flagKey] as any).enabled = enabled;
      }
    },
    resetFeatureFlags: (state) => {
      state.flags = { ...DEV_CONFIG.featureFlags };
    },
    enableAllFeatureFlags: (state) => {
      Object.keys(state.flags).forEach((key) => {
        const flagKey = key as FeatureFlagKey;
        if (state.flags[flagKey]) {
          (state.flags[flagKey] as any).enabled = true;
        }
      });
    },
    disableAllFeatureFlags: (state) => {
      Object.keys(state.flags).forEach((key) => {
        const flagKey = key as FeatureFlagKey;
        if (state.flags[flagKey]) {
          (state.flags[flagKey] as any).enabled = false;
        }
      });
    },
  },
});

// Export actions
export const {
  toggleFeatureFlag,
  resetFeatureFlags,
  enableAllFeatureFlags,
  disableAllFeatureFlags,
} = featureFlagsSlice.actions;

// Export reducer
export default featureFlagsSlice.reducer;

// Selectors
export const selectFeatureFlags = (state: {
  featureFlags: FeatureFlagsState;
}) => state.featureFlags.flags;

export const selectIsFeatureEnabled =
  (flagKey: FeatureFlagKey) => (state: { featureFlags: FeatureFlagsState }) =>
    state.featureFlags.flags[flagKey]?.enabled || false;
