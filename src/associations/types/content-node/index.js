import Editor from './Editor';

const ContentType =
	'application/vnd.nextthought.courses.courseoutlinecontentnode';

export default {
	type: ContentType,

	getEditor() {
		return Editor;
	},
};
