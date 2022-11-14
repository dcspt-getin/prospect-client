import { createSelector } from "reselect";

export const getState = (state) => state.urbanShapes;

export const getTerritorialCoverages = createSelector(
  getState,
  (state) => state.territorialCoverages
);

export const getTerritorialCoveragesLoading = createSelector(
  getState,
  (state) => state.loading
);
