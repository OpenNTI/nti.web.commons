export function constrainAlignment(
	alignment = {},
	{ height: viewHeight, width: viewWidth } = {}
) {
	const clone = { ...alignment };

	if (clone.top != null) {
		clone.maxHeight = viewHeight - (clone.top + (clone.height || 0));
	} else if (clone.bottom != null) {
		clone.maxHeight = viewHeight - clone.bottom;
	}

	if (clone.left != null) {
		clone.maxWidth = viewWidth - clone.left;
	} else if (clone.right != null) {
		clone.maxWidth = viewWidth - clone.right;
	}

	return clone;
}
