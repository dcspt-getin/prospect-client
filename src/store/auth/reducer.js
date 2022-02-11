import {
  AUTHENTICATE_USER,
  LOGOUT_USER,
  AUTHENTICATE_USER_FAILED,
  AUTHENTICATE_USER_PENDING,
  SET_CURRENT_USER,
} from "./types";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  currentUser: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATE_USER:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTHENTICATE_USER_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case AUTHENTICATE_USER_FAILED:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        currentUser: null,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
}
