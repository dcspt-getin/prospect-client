import { createSelector } from "reselect";

const getState = (state) => state.profiles;

export const makeGetActiveProfile = () => {
  return createSelector(getState, (state) => {
    return (
      (state.profiles &&
        Object.values(state.profiles).find((p) => p.status === "ACTIVE")) ||
      {}
    );
  });
};

export const getActiveProfile = makeGetActiveProfile();
