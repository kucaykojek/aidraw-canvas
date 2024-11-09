window.addEventListener("DOMContentLoaded", () => {
  console.log("Loaded Scripts");
});

const canvas = new fabric.Canvas("canvas");
const canvasWrapper = document.getElementById("canvas-wrapper");

const DEFAULT_SELECTION = {
  transparentCorners: false,
  borderColor: "#7168F8",
  cornerColor: "#7168F8",
  cornerStyle: "circle",
};

const DEFAULT_SHAPE_OBJECT_DIFF = 0.25;

(function () {
  window.addEventListener("resize", resizeCanvas, false);

  resizeCanvas();
})();

function resizeCanvas() {
  if (canvasWrapper) {
    canvas.setWidth(canvasWrapper.clientWidth);
    canvas.setHeight(canvasWrapper.clientHeight);

    canvas.requestRenderAll();

    startListen();
  }
}

function sendMessage(handler, value) {
  if (typeof window.flutter_inappwebview !== "undefined") {
    window.flutter_inappwebview.callHandler(handler, value);
  }
}

function startListen() {
  canvas.on("object:added", objectAdded);
  canvas.on("object:modified", (e) => sendMessage("canvasCommonMessage", e));
  canvas.on("object:removed", (e) => sendMessage("canvasCommonMessage", e));
  canvas.on("selection:created", (e) => sendMessage("canvasSelectionMessage", e));
  canvas.on("selection:updated", (e) => sendMessage("canvasSelectionMessage", e));
  canvas.on("selection:cleared", (e) => sendMessage("canvasSelectionMessage", e));
}

function stopListen() {
  canvas.off("object:added");
  canvas.off("object:modified");
  canvas.off("object:removed");
  canvas.off("selection:created");
  canvas.off("selection:updated");
  canvas.off("selection:cleared");
}

function clearCanvas() {
  canvas.clear();
}

function objectAdded(e) {
  e.target.set({ ...DEFAULT_SELECTION });
  sendMessage("canvasCommonMessage", e);
}

function setDrawingMode() {
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  canvas.isDrawingMode = true;
}

function unsetDrawingMode() {
  canvas.isDrawingMode = false;
}

function brushMode() {
  setDrawingMode();
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = "#333";
  canvas.freeDrawingBrush.width = "2";
  canvas.freeDrawingBrush.strokeLineCap = "round";
  canvas.freeDrawingBrush.strokeLineJoin = "bevel";
}

function eraserMode() {
  setDrawingMode();
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = "#FFF";
  canvas.freeDrawingBrush.width = "10";
  canvas.freeDrawingBrush.strokeLineCap = "butt";
  canvas.freeDrawingBrush.strokeLineJoin = "bevel";
}

function addRectangle() {
  unsetDrawingMode();
  const size = DEFAULT_SHAPE_OBJECT_DIFF * canvas.getWidth();
  const obj = new fabric.Rect({
    fill: "red",
    width: size,
    height: size,
    left: (canvas.width - size) / 2,
    top: (canvas.height - size) / 2,
  });
  canvas.add(obj);
  canvas.setActiveObject(obj);
}

function addEllipse() {
  unsetDrawingMode();
  const size = DEFAULT_SHAPE_OBJECT_DIFF * canvas.getWidth();
  const obj = new fabric.Ellipse({
    fill: "blue",
    width: size,
    height: size,
    left: (canvas.width - size) / 2,
    top: (canvas.height - size) / 2,
    rx: size / 2,
    ry: size / 2,
  });
  canvas.add(obj);
  canvas.setActiveObject(obj);
}

function addTriangle() {
  unsetDrawingMode();
  const size = DEFAULT_SHAPE_OBJECT_DIFF * canvas.getWidth();
  const obj = new fabric.Triangle({
    fill: "yellow",
    width: size,
    height: size,
    left: (canvas.width - size) / 2,
    top: (canvas.height - size) / 2,
  });
  canvas.add(obj);
  canvas.setActiveObject(obj);
}
