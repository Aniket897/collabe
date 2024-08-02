import React, { useEffect, useLayoutEffect, useState, RefObject } from "react";
RoughGenerator;
import { Socket } from "socket.io-client";
import { CanvasElement } from "../types";
import { RoughGenerator } from "roughjs/bin/generator";
import { RoughCanvas } from "roughjs/bin/canvas";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../Contexts/auth.context";

const generator = new RoughGenerator();

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>;
  color: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setElements: React.Dispatch<React.SetStateAction<any[]>>;
  elements: CanvasElement[];
  tool: string;
  socket: Socket;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  ctx,
  color,
  setElements,
  elements,
  tool,
  socket,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [searchParamas] = useSearchParams();
  const { uid } = useAuth();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = window.innerHeight * 2;
      canvas.width = window.innerWidth * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = color;
        context.lineWidth = 5;
        context.lineCap = "round";
        context.scale(2, 2);
        ctx.current = context;
      }
    }
  }, [canvasRef, color, ctx]);

  useEffect(() => {
    if (ctx.current) {
      ctx.current.strokeStyle = color;
    }
  }, [color]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          element: tool,
        },
      ]);
    } else {
      setElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: color, element: tool },
      ]);
    }
    setIsDrawing(true);
  };

  useLayoutEffect(() => {
    const roughCanvas = new RoughCanvas(canvasRef.current!);
    if (elements.length > 0) {
      ctx.current?.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
    }
    elements.forEach((ele) => {
      if (ele.element === "rect") {
        roughCanvas.draw(
          generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "line") {
        roughCanvas.draw(
          generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "pencil") {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
      }
    });
  }, [elements, canvasRef, ctx, socket]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    setElements((prevElements) =>
      prevElements.map((ele, index) =>
        index === elements.length - 1
          ? tool === "rect"
            ? {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              }
            : tool === "line"
            ? { ...ele, width: offsetX, height: offsetY }
            : {
                ...ele,
                path: [...ele.path, [offsetX, offsetY]],
              }
          : ele
      )
    );
    socket.emit("drawing", {
      data: elements,
      sessionId: searchParamas.get("sessionId"),
      userId: uid,
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    socket.emit("drawing", {
      data: elements,
      sessionId: searchParamas.get("sessionId"),
      userId: uid,
    });
  };

  return (
    <div
      className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "500px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
