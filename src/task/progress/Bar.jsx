import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';

import Store from '../Store';
import Progress from '../../components/Progress';

import Styles from './Bar.css';

const cx = classnames.bind(Styles);
const t = scoped('common.task.progress.Bar', {
	cancel: 'Cancel',
});

class TaskProgressBar extends React.Component {
	static deriveBindingFromProps(props) {
		return props.task;
	}

	static propTypes = {
		className: PropTypes.string,
		task: PropTypes.object.isRequired,

		monitor: PropTypes.object,
	};

	onCancel = () => {
		const { monitor } = this.props;

		if (monitor.canCancel) {
			monitor.cancel();
		}
	};

	render() {
		const { monitor, className } = this.props;

		if (!monitor) {
			return null;
		}

		return (
			<div className={cx('nti-task-progress-bar', className)}>
				{this.renderMeta(monitor)}
				{monitor.hasProgress && this.renderProgress(monitor)}
			</div>
		);
	}

	renderProgress(task) {
		const { current, total } = task.progress || {};

		return (
			<Progress className={cx('progress')} value={current} max={total} />
		);
	}

	renderMeta(task) {
		return (
			<div className={cx('meta')}>
				{task.hasName && (
					<span className={cx('name')}>{task.name}</span>
				)}
				{task.canCancel && (
					<span className={cx('cancel')} onClick={this.onCancel}>
						{t('cancel')}
					</span>
				)}
			</div>
		);
	}
}

export default decorate(TaskProgressBar, [Store.connect({ task: 'monitor' })]);
