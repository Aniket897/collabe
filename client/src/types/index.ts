export type PencilElement = {
  offsetX: number;
  offsetY: number;
  path: [number, number][];
  stroke: string;
  element: "pencil";
};

export type LineOrRectElement = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  stroke: string;
  element: "line" | "rect";
};

export type CanvasElement = PencilElement | LineOrRectElement;
