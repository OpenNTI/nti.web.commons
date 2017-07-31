import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import BasicEditor from '../components/BasicEditor';
import DateTime from '../../../components/DateTime';
import {getDisplay} from '../../../components/DurationPicker';

const DEFAULT_TEXT = {
	addLabel: 'Add to Assignment',
	draft: 'Draft',
	schedule: 'Scheduled for %(date)s',
	published: 'Published',
	dueDate: 'Due %(date)s',
	noDueDate: 'No Due Date',
	timeLimit: '%(limit)s Time Limit'
};

const t = scoped('common.components.associations.editor.assignment', DEFAULT_TEXT);

function getSubLabels (item) {
	const assignment = item.item;
	let labels = [];

	//TODO: Replace this logic with the shared
	//component for assignment info, once we get
	//it pulled out into a shared place

	if (assignment.isPublished()) {
		labels.push(t('published'));
	} else if (assignment.getAvailableForSubmissionBeginning()) {
		labels.push(t('schedule', {
			date: DateTime.format(assignment.getAvailableForSubmissionBeginning(), 'll')
		}));
	} else {
		labels.push(t('draft'));
	}

	if (assignment.getDueDate()) {
		labels.push(t('dueDate', {
			date: DateTime.format(assignment.getDueDate(), 'll')
		}));
	} else {
		labels.push(t('noDueDate'));
	}

	if (assignment.getMaximumTimeAllowed) {
		labels.push(t('timeLimit', {
			limit: getDisplay(assignment.getMaximumTimeAllowed() / 1000)
		}));
	}


	return labels;
}

AssignmentAssociationEditor.propTypes = {
	item: PropTypes.object.isRequired,
	associations: PropTypes.object
};
export default function AssignmentAssociationEditor ({item, associations}) {
	return (
		<BasicEditor
			className="assignment-association"
			item={item}
			associations={associations}
			subLabels={getSubLabels(item)}
			getString={t}
			disabled={!item.item.CanInsertQuestions}
		/>
	);
}
