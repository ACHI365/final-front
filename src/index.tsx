import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css"
import {
  HashRouter as Router,
  Route,
  } from 'react-router-dom';


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);
