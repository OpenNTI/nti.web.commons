import adjustHeight from './adjust-height';

export default function getDialogPositionForRect(rect) {
	return {
		top: Math.floor(rect.top),
		height: adjustHeight(Math.floor(rect.height)),
	};
}
