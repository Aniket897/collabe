import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  // all are protected routes because auth is handled in authContext
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>HOMEPAGE</>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
