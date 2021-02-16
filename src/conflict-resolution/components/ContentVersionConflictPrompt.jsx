import './ContentVersionConflictPrompt.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import DialogButtons from '../../components/DialogButtons';

const NOOP = () => {};

const YOURS = 'overwrite';
const THEIRS = 'refresh';

const DEFAULT_TEXT = {
	title: 'Conflicting Versions',
	takeYours: 'Force Your Changes',
	takeTheirs: 'Take Their Changes',
	cancel: 'Cancel',
	force: 'Force Yours',
	take: 'Take Theirs',
};

const t = scoped(
	'common.components.content.version-conflict-prompt',
	DEFAULT_TEXT
);

export default class ContentVersionConflictPrompt extends React.Component {
	static propTypes = {
		challenge: PropTypes.object,
		onDismiss: PropTypes.func,
		onConfirm: PropTypes.func,
		onCancel: PropTypes.func,
	};

	static defaultProps = {
		onDismiss: NOOP,
		onConfirm: NOOP,
		onCancel: NOOP,
	};

	state = {
		active: YOURS,
	};

	onCancel = () => {
		const { onDismiss, onCancel } = this.props;

		onCancel();
		onDismiss();
	};

	onConfirm = () => {
		const { onDismiss, onConfirm } = this.props;
		const { active } = this.state;

		onConfirm({ rel: active });
		onDismiss();
	};

	takeYours = () => {
		this.setState({
			active: YOURS,
		});
	};

	takeTheirs = () => {
		this.setState({
			active: THEIRS,
		});
	};

	render() {
		const { challenge } = this.props;
		const { active } = this.state;

		const buttons = [
			{
				className: 'cancel',
				label: t('cancel'),
				onClick: this.onCancel,
			},
			{
				className: 'caution confirm',
				label: active === YOURS ? t('force') : t('take'),
				onClick: this.onConfirm,
			},
		];

		return (
			<div className="content-version-conflict-prompt">
				<div className="body">
					<i className="icon-alert" />
					<div className="message">
						<h3>{t('title')}</h3>
						<p>{challenge.message}</p>
						<ul>
							<li
								className={
									active === YOURS
										? 'selected'
										: 'not-selected'
								}
							>
								<label>
									<input
										type="radio"
										name="content-version-conflict-radio"
										onChange={this.takeYours}
										checked={active === YOURS}
									/>
									<span>{t('takeYours')}</span>
								</label>
							</li>
							<li
								className={
									active === THEIRS
										? 'selected'
										: 'not-selected'
								}
							>
								<label>
									<input
										type="radio"
										name="content-version-conflict-radio"
										onChange={this.takeTheirs}
										checked={active === THEIRS}
									/>
									<span>{t('takeTheirs')}</span>
								</label>
							</li>
						</ul>
					</div>
				</div>
				<DialogButtons buttons={buttons} />
			</div>
		);
	}
}
