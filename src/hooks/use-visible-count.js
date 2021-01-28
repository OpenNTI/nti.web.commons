
const int = x => parseInt(x, 10) || 0;
const gap = el => int(getComputedStyle(el.parentElement).gap);
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing
// TODO: review margin merging rules.
const marginWidth = el => (el = getComputedStyle(el), int(el.marginLeft) + int(el.marginRight));
const marginHeight = el => (el = getComputedStyle(el), int(el.marginTop) + int(el.marginBottom));

const DIMENSION_RESOLVERS = {
	width: el => el.clientWidth,
	height: el => el.clientHeight,
};

const ITEM_DIMENSION_RESOLVERS = {
	width: el => el.offsetWidth + gap(el) + marginWidth(el),
	height: el => el.offsetHeight + gap(el) + marginHeight(el),
};

/**
 * @param {number|string} sizeOrSelector A fixed size or a selector to derive the size.
 * @param {React.Ref<HTMLElement>} ref The container ref object
 * @param {"height"|"width"} [dimension='height'] The dimension to count
 * @returns {number} The amount of items that will fit.
 */
export function useVisibleCount ( sizeOrSelector, ref, dimension = 'height' ) {
	let size = typeof sizeOrSelector === 'number' ? sizeOrSelector : null;
	const selector = size == null ? sizeOrSelector : null;
	const container = ref?.current;

	if (!container) {
		// If we need to derive, ensure we let the caller render at least one
		return selector ? 1 : 0;
	}

	const available = DIMENSION_RESOLVERS[dimension]?.(container) ?? NaN;

	if (isNaN(available)) {
		// Not a block or an unknown
		return 0;
	}

	if (selector) {
		const sampleItem = container.querySelector(selector);
		if (!sampleItem) {
			return NaN;
		}

		size = ITEM_DIMENSION_RESOLVERS[dimension]?.(sampleItem) ?? NaN;
	}

	return Math.floor(available / size);
}
