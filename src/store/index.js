import axios from "axios";
import { combineReducers, createStore } from "redux";

import { registerStore } from "./registerStore";
import middlewares from "./middlewares";
import { verifyCurrentToken, logOutUser } from "./auth/actions";

import authReducer from "./auth/reducer";
import appReducer from "./app/reducer";
import questionsReducer from "./questions/reducer";
import {
  getAppConfigurations,
  getAppTranslations,
  setAppLoaded,
  setCurrentTranslation,
} from "./app/actions";

export default function initStore() {
  const rootReducer = combineReducers({
    auth: authReducer,
    app: appReducer,
    questions: questionsReducer,
  });

  const store = createStore(rootReducer, middlewares);

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response } = error;

      if (response && response.status === 401) {
        store.dispatch(logOutUser());
      } else if (response && response.status === 500) {
        const { data } = response;

        alert(data);
      }

      return Promise.reject(error);
    }
  );

  if (localStorage.getItem("jwtToken")) {
    const token = localStorage.getItem("jwtToken");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    store.dispatch(verifyCurrentToken(token));
  }

  registerStore(store);

  Promise.all([
    store.dispatch(getAppConfigurations()),
    store.dispatch(getAppTranslations()),
  ]).then(() => {
    store.dispatch(setAppLoaded());
  });

  if (localStorage.getItem("currentTranslation")) {
    store.dispatch(
      setCurrentTranslation(localStorage.getItem("currentTranslation"))
    );
  }

  return store;
}
