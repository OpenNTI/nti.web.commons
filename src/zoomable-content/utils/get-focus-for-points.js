function getMidPoint (point1, point2) {
	return point1.middle(point2);
}

export default function getFocusForPoints (points) {
	return getMidPoint(...points);
}
