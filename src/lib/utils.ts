export const x = (angle: number) => Math.sin(angle);
export const y = (angle: number) => -Math.cos(angle);
export const rad = (deg: number) => (Math.PI / 180) * deg;
export const deg = (deg: number) => (180 / Math.PI) * deg;
export const pc = (val: number) => `${val * 50}%`;

export const circle = (angle: number, r: number) => ({
	cx: pc(r * x(angle)),
	cy: pc(r * y(angle)),
});

export const line = (angle: number, r1: number, r2: number) => ({
	x1: pc(r1 * x(angle)),
	y1: pc(r1 * y(angle)),
	x2: pc(r2 * x(angle)),
	y2: pc(r2 * y(angle)),
});

export const xy = (angle: number, r: number) => ({
	x: pc(r * x(angle)),
	y: pc(r * y(angle)),
});

export const arc = (start: number, angle: number, r: number) => {
	const end = start + angle;
	const largeArc = Math.abs(angle) > Math.PI ? 1 : 0;
	const sweep = angle > 0 ? 1 : 0;
	const move = `M ${x(start) * r} ${y(start) * r}`;
	// rx ry angle large-arc-flag sweep-flag x y
	const arc = `A ${r} ${r} 0 ${largeArc} ${sweep} ${x(end) * r} ${y(end) * r}`;
	return `${move} ${arc}`;
};
