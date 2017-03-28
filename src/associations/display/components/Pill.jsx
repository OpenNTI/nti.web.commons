import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

import {Flyout} from '../../../components';

import ToolTip from './PillToolTip';

const DEFAULT_TEXT = {
	shared: {
		zero: 'Not Shared',
		one: 'Shared',
		other: 'Shared with %(count)s'
	}
};

const t = scoped('ASSOCIATION_DISPLAY_PILL', DEFAULT_TEXT);

export default class AssociationPill extends React.Component {
	static propTypes = {
		item: React.PropTypes.shape({
			associationCount: React.PropTypes.number,
			getAssociations: React.PropTypes.func
		}).isRequired,
		scope: React.PropTypes.object,
		onShow: React.PropTypes.func,
		getString: React.PropTypes.func,
		className: React.PropTypes.string
	}

	onClick = () => {
		const {onShow} = this.props;

		if (onShow) {
			onShow();
		}
	}

	getStringFn = () => {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}

	render () {
		const {item, className} = this.props;
		const {associationCount} = item;
		const cls = cx('association-pill', className);
		const getString = this.getStringFn();

		const trigger = (
			<div className={cls} onClick={this.onClick}>
				<i className="icon-link small" />
				<span>{getString('shared', {count: associationCount - 1})}</span>
			</div>
		);

		return !associationCount ? trigger : (
			<Flyout.Triggered arrow hover trigger={trigger} dark>
				<ToolTip {...this.props} />
			</Flyout.Triggered>
		);
	}
}
