import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Homepage";

const App = () => {
  // all are protected routes because auth is handled in authContext
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
