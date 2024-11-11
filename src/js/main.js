window.addEventListener("DOMContentLoaded", () => {
  sendMessage("commonMessage", { ready: true });
});

const DEFAULT_SELECTION = {
  transparentCorners: false,
  borderColor: "#7168F8",
  cornerColor: "#7168F8",
  cornerStyle: "circle",
};
const DEFAULT_COLOR = "#333";
const DEFAULT_SHAPE_OBJECT_DIFF = 0.25;

const canvas = new fabric.Canvas("canvas", {
  selectionBorderColor: DEFAULT_SELECTION.borderColor,
  selectionLineWidth: 1,
  preserveObjectStacking: true,
});
const canvasWrapper = document.getElementById("canvas-wrapper");

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
  canvas.on("object:modified", (e) => sendMessage("canvasObjectMessage", e));
  canvas.on("object:removed", (e) => sendMessage("canvasObjectMessage", e));
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

function fireEvent(e, object) {
  canvas.fire(e, { target: object });
}

function clearCanvas() {
  canvas.clear();
}

function objectAdded(e) {
  e.target.set({ ...DEFAULT_SELECTION });
  sendMessage("canvasObjectMessage", e);
}

function setDrawingMode() {
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  canvas.isDrawingMode = true;
}

function unsetDrawingMode() {
  canvas.isDrawingMode = false;
}

function discardActiveObject() {
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

function deleteActiveObject() {
  canvas.remove(canvas.getActiveObject());
  canvas.getActiveObjects().forEach((obj) => {
    canvas.remove(obj);
  });
  canvas.discardActiveObject().renderAll();
}

async function cloneObject() {
  if (canvas.getActiveObjects().length !== 1) return;

  const cloned = await canvas.getActiveObjects()[0].clone();
  canvas.add(cloned);
  cloned.set({
    left: cloned.left + 10,
    top: cloned.top + 10,
  });

  canvas.setActiveObject(cloned);
  canvas.requestRenderAll();
}

function brushMode(opt) {
  setDrawingMode();
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = opt?.color || DEFAULT_COLOR;
  canvas.freeDrawingBrush.width = Number(opt?.width || 2);
  canvas.freeDrawingBrush.strokeLineCap = "round";
  canvas.freeDrawingBrush.strokeLineJoin = "round";
}

function eraserMode() {
  setDrawingMode();
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = "#FFF";
  canvas.freeDrawingBrush.width = 5;
  canvas.freeDrawingBrush.strokeLineCap = "butt";
  canvas.freeDrawingBrush.strokeLineJoin = "bevel";
}

function addRectangle(color) {
  unsetDrawingMode();
  const size = DEFAULT_SHAPE_OBJECT_DIFF * canvas.getWidth();
  const obj = new fabric.Rect({
    fill: color || DEFAULT_COLOR,
    width: size,
    height: size,
    left: (canvas.width - size) / 2,
    top: (canvas.height - size) / 2,
  });
  canvas.add(obj);
  canvas.setActiveObject(obj);
}

function addEllipse(color) {
  unsetDrawingMode();
  const size = DEFAULT_SHAPE_OBJECT_DIFF * canvas.getWidth();
  const obj = new fabric.Ellipse({
    fill: color || DEFAULT_COLOR,
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

function addTriangle(color) {
  unsetDrawingMode();
  const size = DEFAULT_SHAPE_OBJECT_DIFF * canvas.getWidth();
  const obj = new fabric.Triangle({
    fill: color || DEFAULT_COLOR,
    width: size,
    height: size,
    left: (canvas.width - size) / 2,
    top: (canvas.height - size) / 2,
  });
  canvas.add(obj);
  canvas.setActiveObject(obj);
}

function getActiveObjectIndex() {
  return canvas.getObjects().indexOf(canvas.getActiveObject());
}

function updateSelectedShapeObject(type, opt) {
  if (canvas.getActiveObjects().length !== 1) return;

  console.log(type, opt);

  // canvas
  //   .getActiveObjects()
  //   .filter((obj) => obj.type === type)
  //   .forEach((obj) => obj.set({ ...opt }));

  // canvas.requestRenderAll();
}

function moveObjectBack() {
  if (!canvas || !canvas.getActiveObject()) return;

  const objectIndex = getActiveObjectIndex();
  if (typeof objectIndex !== "number") return;

  const isObjectAlreadyOnBack = canvas ? objectIndex === 0 : true;
  if (isObjectAlreadyOnBack) return;

  canvas.moveObjectTo(canvas.getActiveObject(), objectIndex - 1);
  canvas.requestRenderAll();

  fireEvent("object:modified", canvas.getActiveObjects()[0]);
}

function moveObjectFront() {
  if (!canvas || !canvas.getActiveObject()) return;

  const objectIndex = getActiveObjectIndex();
  if (typeof objectIndex !== "number") return;

  const isObjectAlreadyOnFront = canvas ? objectIndex === canvas.getObjects().length - 1 : true;
  if (isObjectAlreadyOnFront) return;

  canvas.moveObjectTo(canvas.getActiveObject(), objectIndex + 1);
  canvas.requestRenderAll();

  fireEvent("object:modified", canvas.getActiveObjects()[0]);
}
