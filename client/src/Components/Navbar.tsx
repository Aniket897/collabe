import Logout from "./Logout";

const Navbar = () => {
  return (
    <div className="border bg-white">
      <div className="container d-flex align-items-center justify-content-between p-4">
        <div>
          <h2>🎨Collabe</h2>
        </div>
        <div>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
