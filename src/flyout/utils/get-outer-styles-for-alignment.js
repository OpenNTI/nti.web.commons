import {
	VERTICAL,
	ARROW_HEIGHT,
	ARROW_OFFSET
} from '../Constants';

const styleProps = ['top', 'bottom', 'left', 'right', 'width'];

export function getOuterStylesForAlignment (alignment = {}, arrow, primaryAxis, alignToArrow) {
	const clone = {...alignment};

	if (primaryAxis === VERTICAL && arrow) {
		if (clone.top != null) {
			clone.top = clone.top + ARROW_HEIGHT;
		} else if (clone.bottom != null) {
			clone.bottom = clone.bottom + ARROW_HEIGHT;
		}

		if (alignToArrow) {
			if (clone.left != null) {
				clone.left = clone.left - ARROW_OFFSET;
			} else if (clone.right != null) {
				clone.right = clone.right - ARROW_OFFSET;
			}
		}
	}

	return styleProps.reduce((acc, prop) => {
		if (clone[prop] != null) {
			acc[prop] = `${clone[prop]}px`;
		}

		return acc;
	}, {});
}
