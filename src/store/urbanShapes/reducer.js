import {
  SET_TERRITORIAL_COVERAGES,
  SET_TERRITORIAL_COVERAGES_LOADING,
} from "./types";

const initialState = {
  loading: true,
  territorialCoverages: [],
};

export default function urbanShapesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TERRITORIAL_COVERAGES: {
      const { payload } = action;

      return {
        ...state,
        loading: false,
        territorialCoverages: payload,
      };
    }
    case SET_TERRITORIAL_COVERAGES_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
