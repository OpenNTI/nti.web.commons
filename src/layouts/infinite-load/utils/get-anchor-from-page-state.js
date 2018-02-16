export default function getAnchorFromPageState (pageState) {
	const {activePages} = pageState;
	const {after, anchorOffset} = activePages || {};

	return {
		anchorPage: after ? after[0] : 0,
		anchorOffset: anchorOffset || 0
	};
}
