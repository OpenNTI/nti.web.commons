import './SaveCancel.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

import Dialog from '../Dialog';
import { Responsive } from '../../layouts';
import { DialogButtons, Panels } from '../../components';

const DEFAULT_TEXT = {
	cancel: 'Cancel',
	save: 'Save',
	title: 'Title'
};

const t = scoped('common.prompts.layouts.SaveCancel', DEFAULT_TEXT);

class SaveCancel extends React.Component {
	static propTypes = {
		children: PropTypes.node,
		onCancel: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired,
		disableSave: PropTypes.bool,
		getString: PropTypes.func,
		nonDialog: PropTypes.bool,
		className: PropTypes.string
	}

	getStringFn = () => {
		const { getString } = this.props;

		return getString ? t.override(getString) : t;
	}

	renderTitle = () => {
		const getString = this.getStringFn();
		const { onCancel } = this.props;
		return <Panels.TitleBar title={getString('title')} iconAction={onCancel} />;
	}

	renderActionHeader = () => {
		const getString = this.getStringFn();
		const { onCancel, onSave } = this.props;

		return <Panels.ActionHeader title={getString('title')} onCancel={onCancel} onSave={onSave} cancel={getString('cancel')} save={getString('save')} />;
	}

	renderDialogButtons = () => {
		const { onCancel, onSave, disableSave } = this.props;
		const getString = this.getStringFn();
		const buttons = [
			{ label: getString('cancel'), onClick: onCancel },
			{ label: getString('save'), onClick: onSave, disabled: disableSave }
		];
		return <DialogButtons buttons={buttons} />;
	}

	renderContents () {
		const { className } = this.props;

		return (
			<div className={cx('save-cancel-layout', className)}>
				<Responsive.Item
					render={this.renderTitle}
					query={Responsive.not(Responsive.isMobile)}
				/>
				<Responsive.Item
					render={this.renderActionHeader}
					query={Responsive.isMobile}
				/>

				<div className="save-cancel-content">
					{this.props.children}
				</div>

				<Responsive.Item
					render={this.renderDialogButtons}
					query={Responsive.not(Responsive.isMobile)}
				/>
			</div>
		);
	}

	render () {
		const { nonDialog, className } = this.props;
		const cls = cx('save-cancel-dialog', className && className + '-dialog');

		if(nonDialog) {
			return (
				<div className={cls}>
					{this.renderContents()}
				</div>
			);
		}

		return (
			<Dialog className={cls}>
				{this.renderContents()}
			</Dialog>
		);
	}
}

export default SaveCancel;
