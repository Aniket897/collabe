import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import AuthContextProvider from "./Contexts/auth.context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
