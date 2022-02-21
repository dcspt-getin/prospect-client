import normalizeArray from "utils/normalizeArray";

import {
  GET_USER_PROFILES,
  SET_USER_PROFILES,
  CREATE_USER_PROFILE,
  CREATE_USER_PROFILE_FULFILLED,
  UPDATE_USER_PROFILE,
} from "./types";

const initialState = {
  profiles: {},
  isCreating: false,
  isLoading: true,
};

export default function urbanShapesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_PROFILES: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case SET_USER_PROFILES:
      const { payload } = action;

      return {
        ...state,
        profiles: normalizeArray(payload, "id"),
        isLoading: false,
      };
    case CREATE_USER_PROFILE: {
      return {
        ...state,
        isCreating: true,
      };
    }
    case CREATE_USER_PROFILE_FULFILLED: {
      const { payload } = action;

      return {
        ...state,
        profiles: {
          ...state.profiles,
          [payload.id]: payload,
        },
        isCreating: false,
      };
    }
    case UPDATE_USER_PROFILE: {
      const { payload } = action;
      return {
        ...state,
        profiles: {
          ...state.profiles,
          [payload.id]: payload,
        },
      };
    }
    default:
      return state;
  }
}
