import { useEffect, useState } from "react";
import { useSocket } from "../Contexts/socket.context";
import { TextCursorIcon } from "lucide-react";

const Cursors = () => {
  const [cursors, setCursors] = useState<{
    [userId: string]: { x: number; y: number; username: string };
  }>({});

  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("cursor-move", ({ x, y, username, userId }) => {
        console.log(username, x, y);
        setCursors((pre) => ({ ...pre, [userId]: { x, y, username } }));
      });
    }
  }, [socket]);

  return (
    <>
      {Object.entries(cursors).map(([userId, { x, y, username }]) => (
        <div
          key={userId}
          style={{
            position: "absolute",
            left: x,
            top: y,
            height: "30px",
            zIndex: 1000,
            borderRadius: "50%",

            transform: "translate(-50%, -50%)",
          }}
        >
          <TextCursorIcon size={10} />
          <p
            style={{
              fontSize: "10px",
              backgroundColor: "green",
              color: "white",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {username}
          </p>
        </div>
      ))}
    </>
  );
};

export default Cursors;
