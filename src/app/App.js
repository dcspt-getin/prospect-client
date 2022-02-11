import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.css";
import "styles/tailwind.output.css";
import "semantic-ui-css/semantic.min.css";

import configureStore from "store";

import AppRouter from "./AppRouter";

// Configure redux store
const store = configureStore();

function App() {
  return (
    <div className="App bg-gray-50">
      <Router basename={process.env.PUBLIC_URL}>
        <Provider store={store}>
          <AppRouter />
        </Provider>
      </Router>
    </div>
  );
}

export default App;
