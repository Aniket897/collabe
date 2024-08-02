import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Room from "./Pages/Room";
import { Toaster } from "sonner";

const App = () => {
  // all are protected routes because auth is handled in authContext
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </>
  );
};

export default App;
