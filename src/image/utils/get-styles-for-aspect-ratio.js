/**
 * Get the styles that need to be applied to maintain a
 * certain aspect ratio
 *
 * ratio = width / height
 * padding-bottom = ((100 / ratio) * elementWidth)
 *
 * 
 * @param  {number} ratio Aspect ratio to enforce
 * @returns {Object}       styles to apply
 */
export default function getStylesForAspectRatio (ratio) {
	return {
		position: 'relative',
		height: 0,
		overflow: 'hidden',
		paddingBottom: `${100 / ratio}%`
	};
}