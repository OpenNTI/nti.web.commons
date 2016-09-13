import React from 'react';

import {modal} from '../../../prompts';
import TitleBar from '../../../components/panels/TitleBar';

import Editor from './View';

AssociationEditorModal.propTypes = {
	title: React.PropTypes.string,
	onDismiss: React.PropTypes.string
};
export default function AssociationEditorModal (props) {
	const {title, onDismiss, ...otherProps} = props;

	return (
		<div className="association-editor-modal">
			<TitleBar title={title} iconAction={onDismiss} />
			<div className="content">
				<Editor {...otherProps} />
			</div>
		</div>
	);
}

export function openEditorModal (title, associations, filterFn, getString) {
	modal(
		(
			<AssociationEditorModal title={title} associations={associations} filterFn={filterFn} getString={getString} />
		),
		'associations-editor-modal-wrapper'
	);
}
