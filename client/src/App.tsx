import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/Homepage";
import Room from "./Pages/Room";
import Whiteboard from "./Components/Whiteboard";

const App = () => {
  // all are protected routes because auth is handled in authContext
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room" element={<Room />}>
        <Route path="whiteboard/:sessionId" element={<Whiteboard />} />
      </Route>
    </Routes>
  );
};

export default App;
