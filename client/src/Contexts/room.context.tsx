import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { initSocket } from "../Services/socket-io";
import Loader from "../Components/Loader";

const roomContext = createContext({});

export const useRoom = () => {
  return useContext(roomContext);
};

export default function RoomContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSocketConnection = async () => {
      const _socket = await initSocket();
      setSocket(_socket);
      setLoading(false);
    };

    if (!socket) {
      handleSocketConnection();
    }
  }, []);

  if (loading) {
    return <Loader />;
  }
  return <roomContext.Provider value={{}}>{children}</roomContext.Provider>;
}
