import { createContext, MouseEvent, useEffect, useRef, useState } from "react";

interface CanvasContext {
	canvasContext: CanvasRenderingContext2D | null | undefined;
}

const CanvasContext = createContext<CanvasContext>({
	canvasContext: undefined,
});

type MousePos = { x: number; y: number };
type MouseDistance = { width: number; height: number };

type Shape = {
	id: string;
	path: Path2D;
	size: MouseDistance;
	location: MousePos;
};

let mouseBegin: MousePos | null | undefined;

const CanvasContextProvider = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [canvasContext, setCanvasContext] = useState<
		CanvasRenderingContext2D | null | undefined
	>();

	const [shapes, setShapes] = useState<Shape[]>([]);
	const [selectedShape, setSelectedShape] = useState<
		Shape | undefined | null
	>();

	useEffect(() => {
		if (canvasContext) return;

		setCanvasContext(canvasRef.current?.getContext("2d"));
	}, [canvasContext]);

	const getMousePos = (
		canvas: HTMLCanvasElement,
		evt: MouseEvent<HTMLCanvasElement>
	): MousePos => {
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
		mouseStart: MousePos,
		mouseEnd: MousePos
	): MouseDistance => {
		return {
			width: mouseEnd.x - mouseStart.x,
			height: mouseEnd.y - mouseStart.y,
		};
	};

	const selectShape = (
		canvasContext: CanvasRenderingContext2D,
		shape: Shape
	) => {
		if (selectedShape && shape.id != selectedShape.id) {
			unselectedShape(canvasContext, selectedShape);
		}

		canvasContext.clearRect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);
		canvasContext.strokeStyle = "red";
		canvasContext.stroke(shape.path);
		setSelectedShape(shape);
	};

	const unselectedShape = (
		canvasContext: CanvasRenderingContext2D,
		shape: Shape
	) => {
		canvasContext.clearRect(
			shape.location.x,
			shape.location.y,
			shape.size.width,
			shape.size.height
		);
		canvasContext.strokeStyle = "#000";
		canvasContext.stroke(shape.path);
	};

	const drawShape = (
		canvasContext: CanvasRenderingContext2D,
		shape: Shape,
		mouseStartPos: MousePos,
		size: MouseDistance
	) => {
		shape.path.rect(
			mouseStartPos.x,
			mouseStartPos.y,
			size.width,
			size.height
		);

		canvasContext.strokeStyle = "#000";
		canvasContext.stroke(shape.path);
		setShapes((shapes) => [...shapes, shape]);
	};

	const handleClick = (event: MouseEvent<HTMLCanvasElement>) => {
		if (!canvasContext || canvasRef.current === null) return;
		const mousePos = getMousePos(canvasRef?.current!, event);

		if (event.type === "mousedown") {
			for (let i = 0; i < shapes.length; i++) {
				const shape = shapes[i];

				const shapeHit = canvasContext.isPointInPath(
					shape.path,
					mousePos.x,
					mousePos.y
				);

				if (shapeHit) {
					selectShape(canvasContext, shape);
					break;
				}
			}

			mouseBegin = mousePos;
		} else {
			if (!mouseBegin) return;

			const distance = getMouseTravelDistance(mouseBegin, mousePos);

			if (distance.width === 0 || distance.height === 0) return;

			const shape: Shape = {
				id: crypto.randomUUID(),
				path: new Path2D(),
				size: { width: distance.width, height: distance.height },
				location: { x: mouseBegin.x, y: mouseBegin.y },
			};

			drawShape(canvasContext, shape, mouseBegin, distance);
		}
	};

	return (
		<CanvasContext.Provider
			value={{
				canvasContext,
			}}
		>
			<canvas
				ref={canvasRef}
				className="canvas"
				onMouseDown={handleClick}
				onMouseUp={handleClick}
				height={1024}
				width={1024}
			/>
		</CanvasContext.Provider>
	);
};

export default CanvasContextProvider;

export { CanvasContext };
