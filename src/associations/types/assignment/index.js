import Editor from './Editor';

const AssignmentType = 'application/vnd.nextthought.assessment.assignment';
const TimedAssignmentType = 'application/vnd.nextthought.assessment.timedassignment';

export default {
	type: {[AssignmentType]: true, [TimedAssignmentType]: true},

	getEditor () {
		return Editor;
	}
};
