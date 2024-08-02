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

export type User = {
  userId: string;
  username: string;
  socketId: string;
};



export type Message = {
  username : string;
  text : string
}

export type CanvasElement = PencilElement | LineOrRectElement;
