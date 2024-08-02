import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { initSocket } from "../Services/socket-io";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type socketContextType = {
  handleSocketConnection: () => void;
  socket: Socket | undefined;
};

const socketContext = createContext<socketContextType>({} as socketContextType);

export const useSocket = () => {
  return useContext(socketContext);
};

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket>();

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      socket?.disconnect();
    }
  } , []);

  const handleSocketConnection = async () => {
    setLoading(true);
    const _socket = await initSocket();
    setSocket(_socket);
    _socket.on("connect_error", (err) => handleErrors(err.message));
    _socket.on("connect_failed", (err) => handleErrors(err));
    setLoading(false);
  };

  function handleErrors(e: string) {
    toast.error(e);
    navigate("/");
  }

  if (loading) {
    return <p>Loading....</p>;
  }

  return (
    <socketContext.Provider value={{ socket, handleSocketConnection }}>
      {children}
    </socketContext.Provider>
  );
}
