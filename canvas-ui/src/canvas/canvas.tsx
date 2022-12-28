import { useEffect, useRef } from "react";
import CanvasHandler from "./canvasHandler";

const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		CanvasHandler(canvasRef.current!);

		canvasRef.current.width = window.innerWidth;
		canvasRef.current.height = window.innerHeight;
	}, [canvasRef.current]);

	return <canvas ref={canvasRef} />;
};

export default Canvas;
