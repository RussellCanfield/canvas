import { createContext, useEffect, useRef } from "react";
import CanvasHandler from "../canvasHandler";

interface CanvasContext {}

const CanvasContext = createContext<CanvasContext>({});

const CanvasContextProvider = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		CanvasHandler(canvasRef.current!);

		canvasRef.current.width = window.innerWidth;
		canvasRef.current.height = window.innerHeight;
	}, [canvasRef.current]);

	return (
		<CanvasContext.Provider value={{}}>
			<canvas ref={canvasRef} />
		</CanvasContext.Provider>
	);
};

export default CanvasContextProvider;

export { CanvasContext };
