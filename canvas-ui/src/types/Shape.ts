export type Coordinate = {
	x: number;
	y: number;
};

export type Size = {
	width: number;
	height: number;
};

export type Shape = {
	id: string;
	path: Path2D;
	size: Size;
	location: Coordinate;
};
