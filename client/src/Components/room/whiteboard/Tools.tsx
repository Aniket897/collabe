import {
  Minus,
  Pencil,
  RectangleHorizontal,
  Redo,
  Trash2,
  Undo,
} from "lucide-react";

type toolsPropTypes = {
  current: string;
  size: 5 | 10 | 15;
  color: string;
  handleClear: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  setActive: (item: string) => void;
  setColor: (color: string) => void;
  setSize: (size: 5 | 10 | 15) => void;
};

const colors = ["red", "black", "green", "yellow"];
const brushSizes: [5, 10, 15] = [5, 10, 15];

const Tools = ({
  current,
  handleClear,
  handleRedo,
  handleUndo,
  color,
  setColor,
  setActive,
  size,
  setSize,
}: toolsPropTypes) => {
  return (
    <div className="position-fixed bg-white shadow-sm d-flex align-items-center justify-content-center gap-1 flex-column tools">
      <div className="d-flex flex-column gap-4 py-4">
        <div>
          <p>Colors:</p>
          <div className="colorsContainer">
            {colors.map((_color, index) => {
              return (
                <div
                  style={{
                    border: "3px solid",
                    padding: "5px",
                    margin: "auto",
                    borderColor: _color == color ? color : "transparent",
                    cursor: "pointer",
                  }}
                  key={index}
                  onClick={() => {
                    setColor(_color);
                  }}
                >
                  <div
                    style={{ backgroundColor: _color }}
                    className="colorCard"
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BRUSH SIZES */}
        <div>
          <p>Brush size:</p>
          <div className="d-flex align-items-center gap-5 justify-content-center">
            {brushSizes.map((_size, index) => {
              return (
                <div
                  key={index}
                  style={{
                    border: "1px solid",
                    padding: "5px",
                    borderRadius: "50%",
                    borderColor: size == _size ? "black" : "transparent",
                  }}
                  onClick={() => {
                    setSize(_size);
                  }}
                >
                  <div
                    style={{
                      width: _size,
                      height: _size,
                      backgroundColor: "black",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shapes */}
        <div>
          <p>Shapes</p>
          <div className="d-flex align-items-center gap-4">
            <div
              onClick={() => {
                setActive("pencil");
              }}
              className={`toolItem ${current == "pencil" && "activeTool"}`}
            >
              <Pencil size={15} />
            </div>
            <div
              onClick={() => {
                setActive("rect");
              }}
              className={`toolItem ${current == "rect" && "activeTool"}`}
            >
              <RectangleHorizontal size={15} />
            </div>
            <div
              onClick={() => {
                setActive("line");
              }}
              className={`toolItem ${current == "line" && "activeTool"}`}
            >
              <Minus size={15} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <p>Actions</p>
          <div className="d-flex align-items-center justify-content-center gap-5">
            <Undo onClick={handleUndo} size={15} />
            <Redo onClick={handleRedo} size={15} />
            <Trash2 onClick={handleClear} size={15} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
