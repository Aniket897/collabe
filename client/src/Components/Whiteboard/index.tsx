import { useEffect, useRef, useState } from "react";
import { Canvas, Circle, PencilBrush, Rect } from "fabric";

const height = window.innerHeight;
const width = window.innerWidth;

const Whiteboard = () => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [mode, setMode] = useState<
    "select" | "pencil" | "rect" | "circle" | "eraser"
  >("select");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = new Canvas(canvasRef.current!, {
      height,
      width,
    });

    setCanvas(canvas);
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    if (mode == "pencil") {
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
    }

    if (mode === "eraser") {
      // canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    } else {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
    }
  }, [canvas, mode]);

  const handleAddRect = () => {
    if (canvas) {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 50,
        height: 50,
      });
      canvas.add(rect);
      canvas.renderAll();
    }
  };

  const handleAddCircle = () => {
    if (canvas) {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: "green",
        radius: 50,
      });
      canvas.add(circle);
      canvas.renderAll();
    }
  };

  const handleClear = () => {
    if (canvas) {
      canvas.clear();
    }
  };

  return (
    <div>
      <p>whiteboard</p>
      <div>
        <button onClick={() => setMode("select")}>Select</button>
        <button onClick={() => setMode("pencil")}>Pencil</button>
        <button onClick={() => setMode("eraser")}>Eraser</button>
        <button onClick={handleAddRect}>Rectangle</button>
        <button onClick={handleAddCircle}>Circle</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;
