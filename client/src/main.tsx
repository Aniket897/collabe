import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import AuthContextProvider from "./Contexts/auth.context.tsx";
import SocketContextProvider from "./Contexts/socket.context.tsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
