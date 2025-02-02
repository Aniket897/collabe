import { useEffect, useRef, useState } from "react";
import { useSocket } from "../Contexts/socket.context";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../Contexts/auth.context";
import Loader from "../Components/Loader";
import { CanvasElement } from "../types";
import { toast } from "sonner";
import Tools from "../Components/room/whiteboard/Tools";
import Chat from "../Components/room/Chat";
import Canvas from "../Components/room/whiteboard/Canvas";
import Header from "../Components/room/Header";

const Room = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { socket, handleSocketConnection } = useSocket();
  const sessionId = searchParams.get("sessionId");
  const { uid, profile } = useAuth();

  // for whiteboard
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [history, setHistory] = useState<CanvasElement[]>([]);
  const [color, setColor] = useState("black");
  const [tool, setTool] = useState("pencil");
  const [size, setSize] = useState<5 | 10 | 15>(5);

  useEffect(() => {
    if (!socket) {
      handleSocketConnection();
    } else {
      if (sessionId) {
        socket.emit("join", {
          userId: uid,
          username: profile?.given_name,
          sessionId,
        });
      }

      if (!sessionId) {
        socket.emit("create", {
          userId: uid,
          username: profile?.given_name,
        });
      }

      socket.on("joined", ({ sessionId, data }) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("sessionId", sessionId);
        setSearchParams(newSearchParams);
        setElements(data);
        setLoading(false);
        toast.success("Room Joined Successfully");
      });

      socket.on("drawing", ({ data }) => {
        setElements(data);
      });
    }
    return () => {
      if (socket) {
        socket.off("create");
        socket.off("join");
        socket.off("joined");
        socket.off("drawing");
      }
    };
  }, [socket]);

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#f6f0f0";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      setElements([]);
    }
  };

  const undo = () => {
    if (!elements.length) return;
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.filter((_, index) => index !== elements.length - 1)
    );
  };

  const redo = () => {
    if (!history.length) return;
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) =>
      prevHistory.filter((_, index) => index !== history.length - 1)
    );
  };

  if (loading) {
    return (
      <div className="pageLoader">
        <Loader />
        <p style={{ fontSize: "12px" }}>
          using free services it might take upto 60 sec to load
        </p>
      </div>
    );
  }

  return (
    <div>
      <Canvas
        canvasRef={canvasRef}
        ctx={ctx}
        color={color}
        setElements={setElements}
        elements={elements}
        tool={tool}
        socket={socket!}
        size={size}
      />
      <Tools
        current={tool}
        handleClear={clearCanvas}
        handleRedo={redo}
        handleUndo={undo}
        color={color}
        size={size}
        setColor={(color) => {
          setColor(color);
        }}
        setActive={(item) => {
          setTool(item);
        }}
        setSize={(size) => setSize(size)}
      />
      <Header />
      <Chat />
    </div>
  );
};

export default Room;
