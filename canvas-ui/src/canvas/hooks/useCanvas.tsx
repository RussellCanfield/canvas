import { useContext } from "react";
import { CanvasContext } from "../context/canvasContext";

interface IUseCanvas {
	drawShape: () => void;
}

const useCanvas = () => {
	const { canvasContext } = useContext(CanvasContext);

	const drawShape = (x: number, y: number) => {
		if (!canvasContext) return;

		canvasContext.strokeStyle = "#000";
		canvasContext.strokeRect(x, y, 64, 64);

		console.log("draw");
	};

	return {
		drawShape,
	};
};

export default useCanvas;
