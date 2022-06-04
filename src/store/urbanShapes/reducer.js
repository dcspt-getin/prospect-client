import { SET_TERRITORIAL_COVERAGES } from "./types";

const initialState = {
  isCreating: false,
  isLoading: true,
  territorialCoverages: [],
};

export default function urbanShapesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TERRITORIAL_COVERAGES: {
      const { payload } = action;

      return {
        ...state,
        territorialCoverages: payload,
      };
    }
    default:
      return state;
  }
}
