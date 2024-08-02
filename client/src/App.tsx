import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Room from "./Pages/Room";

const App = () => {
  // all are protected routes because auth is handled in authContext
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room" element={<Room />} />
    </Routes>
  );
};

export default App;
