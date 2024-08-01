import { useEffect } from "react";
import { useSocket } from "../../Contexts/socket.context";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/auth.context";

const Room = () => {
  const { socket, handleSocketConnection } = useSocket();
  const { uid, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("USEEFFECT CALLED");
    if (!socket) {
      handleSocketConnection();
      console.log("HADLE CALLED");
    }

    if (socket) {
      console.log("SOCEKET CALLED");
      socket.emit("create", {
        userId: uid,
        username: profile?.given_name,
      });

      socket.on("joined", (data) => {
        navigate(`/room/whiteboard/${data.sessionId}`);
      });

      return () => {
        if (socket) {
          socket.off("create");
          socket.off("joined");
        }
      };
    }
  }, [socket]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Room;
