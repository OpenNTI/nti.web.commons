import ContentNode from './content-node';
import Default from './default';

const TYPES = [
	ContentNode
];

export function getEditorCmpFor (item) {
	for (let Type of TYPES) {
		if (item.type === Type.type) {
			return Type.getEditor();
		}
	}

	return Default.getEditor();
}
