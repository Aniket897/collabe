import { Button } from "react-bootstrap";
import client from "../Services/keycloak";
import { LogOut } from "lucide-react";
import { useState } from "react";
import Loader from "./Loader";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    client.logout().finally(() => {
      setLoading(false);
    });
  };
  return (
    <Button onClick={handleLogout}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <LogOut size={20} />
        </>
      )}
    </Button>
  );
};

export default Logout;
