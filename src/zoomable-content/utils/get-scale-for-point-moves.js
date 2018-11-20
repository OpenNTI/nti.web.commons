//For now just use the first two points
function getDistance (p1, p2) {
	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;

	return Math.sqrt((dx * dx) + (dy * dy));
}

export default function getScaleForPointMoves (points = [], originalPoints = []) {
	const distance = getDistance(...points);
	const originalDistance = getDistance(...originalPoints);

	return distance / originalDistance;
}
