import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {decorate} from '@nti/lib-commons';
import {scoped} from '@nti/lib-locale';

import Store from '../Store';
import Progress from '../../components/Progress';
import {SeparatedInline} from '../../components/list';

import Styles from './Panel.css';

const cx = classnames.bind(Styles);
const t = scoped('common.task.progress.Panel', {
	cancel: 'Cancel'
});

class TaskProgressPanel extends React.Component {
	static deriveBindingFromProps (props) { return props.task; }

	static propTypes = {
		className: PropTypes.string,
		task: PropTypes.object.isRequired,
		header: PropTypes.string,
		subHeader: PropTypes.string,

		monitor: PropTypes.object
	}


	onCancel = () => {
		const {monitor} = this.props;

		if (monitor.canCancel) {
			monitor.cancel();
		}
	}


	render () {
		const {monitor, className, header, subHeader} = this.props;

		if (!monitor) { return null; }

		return (
			<div className={cx('nti-task-panel', className)}>
				{header && (<div className={cx('header')}>{header}</div>)}
				{subHeader && (<div className={cx('sub-header')}>{subHeader}</div>)}
				{monitor.hasProgress && this.renderProgress(monitor)}
				{this.renderMeta(monitor)}
			</div>
		);
	}


	renderProgress (task) {
		const {current, total} = task.progress || {};

		return (
			<Progress className={cx('progress')} value={current} max={total} />
		);
	}

	renderMeta (task) {
		return (
			<SeparatedInline className={cx('meta')}>
				{task.hasName && (<span>{task.name}</span>)}
				{task.canCancel && (<span className={cx('cancel')} onClick={this.onCancel}>{t('cancel')}</span>)}
			</SeparatedInline>
		);
	}
}

export default decorate(TaskProgressPanel, [
	Store.connect({'task': 'monitor'})
]);
