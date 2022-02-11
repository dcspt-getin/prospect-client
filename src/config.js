let apiBaseUrl = "http://lvh.me:8000/api";

switch (process.env.REACT_APP_ENV) {
  case "staging":
    apiBaseUrl = "";
    break;
  case "production":
    apiBaseUrl = "";
    break;

  default:
    break;
}

export const API_BASE_URL = apiBaseUrl;

export const DEFAULT_SELECTED_LANG = "pt";
