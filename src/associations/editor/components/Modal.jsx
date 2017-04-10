import React from 'react';
import PropTypes from 'prop-types';

import {modal} from '../../../prompts';
import TitleBar from '../../../components/panels/TitleBar';
import DialogButtons from '../../../components/DialogButtons';

import Editor from './View';

AssociationEditorModal.propTypes = {
	title: PropTypes.string,
	onDismiss: PropTypes.func
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

export function openEditorModal (title, associations, filterFn, getString, beforeClose = () => {}) {
	modal(
		(
			<AssociationEditorModal title={title} associations={associations} filterFn={filterFn} getString={getString} />
		),
		{
			className: 'associations-editor-modal-wrapper',
			onBeforeDismiss () {
				beforeClose();
			}
		}
	);
}
