import { Plus } from "lucide-react";
import Navbar from "../../Components/Navbar";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="container p-5">
        <h3 className="my-3">Available templates</h3>
        <Link to={"/room"}>
          <div className="d-flex align-items-center flex-column justify-content-center newRoomCard mt-5">
            <Plus size={50} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
