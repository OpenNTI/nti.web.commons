import ContentNode from './content-node';
import Assignment from './assignment';
import Default from './default';

const TYPES = [
	ContentNode,
	Assignment
];

export function getEditorCmpFor (item) {
	for (let Type of TYPES) {
		if (item.type === Type.type || Type.type[item.type]) {
			return Type.getEditor();
		}
	}

	return Default.getEditor();
}
