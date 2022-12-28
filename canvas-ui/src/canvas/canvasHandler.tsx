import { Coordinate, Shape } from "../types/Shape";

const CanvasHandler = (canvas: HTMLCanvasElement) => {
	const canvasContext = canvas.getContext("2d");
	const shapes: Shape[] = [];

	let mouseBegin: Coordinate;
	let selectedShape: Shape;
	let isDragging = false;
	let shouldDraw = false;
	let draggedShape: Shape | null | undefined;

	let lastMouseX = 0;
	let lastMouseY = 0;

	const getMousePos = (
		canvas: HTMLCanvasElement,
		evt: MouseEvent
	): Coordinate => {
		var rect = canvas.getBoundingClientRect();
		return {
			x:
				((evt.clientX - rect.left) / (rect.right - rect.left)) *
				canvas.width,
			y:
				((evt.clientY - rect.top) / (rect.bottom - rect.top)) *
				canvas.height,
		};
	};

	const getMouseTravelDistance = (
		mouseStart: Coordinate,
		mouseEnd: Coordinate
	): Coordinate => {
		return {
			x: mouseEnd.x - mouseStart.x,
			y: mouseEnd.y - mouseStart.y,
		};
	};

	const drawShape = (
		canvasContext: CanvasRenderingContext2D,
		shape: Shape
	) => {
		shape.path = new Path2D();
		shape.path.rect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);
		shape.path.closePath();

		//canvasContext.globalCompositeOperation = "source-over";
		canvasContext.strokeStyle = "#000";
		canvasContext.stroke(shape.path);

		canvasContext.fillStyle = "#fff";
		canvasContext.fillRect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);
	};

	const clearShape = (
		canvasContext: CanvasRenderingContext2D,
		shape: Shape
	) => {
		shape.path.rect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);

		canvasContext.strokeStyle = "rgba(0,0,0,0)";
		canvasContext.stroke(shape.path);
	};

	const selectShape = (shape: Shape) => {
		if (!canvasContext) return;

		if (selectedShape && shape.id != selectedShape.id) {
			unselectShape(selectedShape);
		}

		shape.path = new Path2D();
		shape.path.rect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);
		shape.path.closePath();

		canvasContext.strokeStyle = "red";
		canvasContext.stroke(shape.path);

		canvasContext.fillStyle = "#fff";
		canvasContext.fillRect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);

		selectedShape = shape;
		isDragging = true;
		shouldDraw = true;
		draggedShape = shape;
	};

	const unselectShape = (shape: Shape) => {
		if (!canvasContext) return;

		shape.path = new Path2D();
		shape.path.rect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);
		shape.path.closePath();

		canvasContext.strokeStyle = "#000";
		canvasContext.stroke(shape.path);

		canvasContext.fillStyle = "#fff";
		canvasContext.fillRect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);
	};

	const mouseDown = (event: MouseEvent) => {
		if (!canvasContext) return;

		const mousePos = getMousePos(canvas, event);

		for (let i = 0; i < shapes.length; i++) {
			const shape = shapes[i];

			const shapeHit = canvasContext.isPointInPath(
				shape.path,
				mousePos.x,
				mousePos.y
			);

			if (shapeHit) {
				selectShape(shape);
				break;
			}
		}

		mouseBegin = mousePos;
		lastMouseX = mousePos.x;
		lastMouseY = mousePos.y;
	};

	const mouseUp = (event: MouseEvent) => {
		if (isDragging) {
			isDragging = false;
			shouldDraw = false;
			drawShape(canvasContext!, draggedShape!);
			draggedShape = null;
			return;
		}

		if (!canvasContext) return;

		const mousePos = getMousePos(canvas, event);

		if (!mouseBegin) return;

		const distance = getMouseTravelDistance(mouseBegin, mousePos);

		if (distance.x === 0 || distance.y === 0) return;

		const shape: Shape = {
			id: crypto.randomUUID(),
			path: new Path2D(),
			size: { width: distance.x, height: distance.x },
			location: { x: mouseBegin.x, y: mouseBegin.y },
		};

		drawShape(canvasContext, shape);
		shapes.push(shape);
	};

	const mouseMove = (event: MouseEvent) => {
		if (!canvasContext || !isDragging) return;

		const mousePos = getMousePos(canvas, event);
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < shapes.length; i++) {
			const shape = shapes[i];

			if (shape.id === draggedShape?.id) {
				const deltaX = lastMouseX - mousePos.x;
				const deltaY = lastMouseY - mousePos.y;

				draggedShape.location = {
					x: draggedShape.location.x - deltaX,
					y: draggedShape.location.y - deltaY,
				};

				lastMouseX = mousePos.x;
				lastMouseY = mousePos.y;
			} else {
				drawShape(canvasContext, shape);
			}
		}

		drawShape(canvasContext, draggedShape!);
	};

	const throttle = (callback: (...args: any[]) => void, delay: number) => {
		let shouldCall = true;

		return (...args: []) => {
			if (!shouldCall) return;

			shouldCall = false;
			callback.apply(this, args);
			/*setTimeout(() => {
				shouldCall = true;
			}, delay);*/
			window.requestAnimationFrame(() => {
				shouldCall = true;
				//callback.apply(this, args);
			});
		};
	};

	canvas.addEventListener("mousedown", mouseDown);
	canvas.addEventListener("mouseup", mouseUp);
	canvas.addEventListener("mousemove", throttle(mouseMove, 200));
};

export default CanvasHandler;
