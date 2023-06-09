let apiBaseUrl = "http://localhost:8000/api";
// let apiBaseUrl = "https://dcspt-getin.ua.pt/prospect/api";
// let apiBaseUrl = "https://dcspt-drivitup.ua.pt/housepref/api";

switch (process.env.REACT_APP_ENV) {
  case "staging":
    apiBaseUrl = "https://thawing-wildwood-49356.herokuapp.com/api";
    break;
  case "production":
    apiBaseUrl =
      process.env.REACT_APP_API_BASE_URL || "https://protcapp.tk/api";
    break;

  default:
    break;
}

export const API_BASE_URL = apiBaseUrl;

export const DEFAULT_SELECTED_LANG = "pt";
