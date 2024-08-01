import { Plus } from "lucide-react";
import Navbar from "../../Components/Navbar";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="container p-5">
        <h3 className="my-3">Available templates</h3>
        <div className="d-flex align-items-center flex-column justify-content-center newRoomCard mt-5">
          <Plus size={50} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
