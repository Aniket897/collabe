import { Pen, RectangleHorizontal, Redo, Trash2, Undo } from "lucide-react";

type toolsPropTypes = {
  current: string;
  handleClear: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  setActive: (item: string) => void;
  color: string;
  setColor: (color: string) => void;
};

const Tools = ({
  current,
  handleClear,
  handleRedo,
  handleUndo,
  color,
  setColor,
  setActive,
}: toolsPropTypes) => {
  return (
    <div className="position-fixed bg-white shadow-sm d-flex align-items-center justify-content-center gap-1 flex-column tools">
      <div
        onClick={() => {
          setActive("pencil");
        }}
        className={`toolItem ${current == "pencil" && "activeTool"}`}
      >
        <Pen size={25} />
        <p>Pencil</p>
      </div>
      <div
        onClick={() => {
          setActive("rect");
        }}
        className={`toolItem ${current == "rect" && "activeTool"}`}
      >
        <RectangleHorizontal size={25} />
        <p>Rectangle</p>
      </div>
      <div className="toolItem" onClick={handleClear}>
        <Trash2 size={25} />
        <p>Clear</p>
      </div>
      <div className="toolItem" onClick={handleRedo}>
        <Redo size={25} />
        <p>Redo</p>
      </div>
      <div className="toolItem" onClick={handleUndo}>
        <Undo size={25} />
        <p>Undo</p>
      </div>

      <div className="toolItem">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Tools;
