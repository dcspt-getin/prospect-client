import React from "react";
import ReactDOM from "react-dom";
// import * as Sentry from "@sentry/react";
// import { Integrations } from "@sentry/tracing";

import "./index.css";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";

// Sentry.init({
//   dsn: "https://1735d7cc7447497b8c2b61ee331e3588@o1067025.ingest.sentry.io/6060303",
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
