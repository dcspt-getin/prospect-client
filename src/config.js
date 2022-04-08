let apiBaseUrl = "http://localhost:8000/api";

switch (process.env.REACT_APP_ENV) {
  case "staging":
    apiBaseUrl = "https://thawing-wildwood-49356.herokuapp.com/api";
    break;
  case "production":
    apiBaseUrl = "";
    break;

  default:
    break;
}

export const API_BASE_URL = apiBaseUrl;

export const DEFAULT_SELECTED_LANG = "pt";
