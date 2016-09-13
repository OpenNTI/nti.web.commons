import React from 'react';

import {modal} from '../../../prompts';
import TitleBar from '../../../components/panels/TitleBar';
import DialogButtons from '../../../components/DialogButtons';

import Editor from './View';

AssociationEditorModal.propTypes = {
	title: React.PropTypes.string,
	onDismiss: React.PropTypes.func
};
export default function AssociationEditorModal (props) {
	const {title, onDismiss, ...otherProps} = props;
	const buttons = [
		{label: 'Done', onClick: onDismiss}
	];

	return (
		<div className="association-editor-modal">
			<TitleBar title={title} iconAction={onDismiss} />
			<div className="content">
				<Editor {...otherProps} />
			</div>
			<DialogButtons buttons={buttons} />
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
