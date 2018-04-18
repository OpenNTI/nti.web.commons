import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import * as Flyout from '../../../flyout';

import ToolTip from './PillToolTip';

const DEFAULT_TEXT = {
	shared: {
		zero: 'Not Shared',
		one: 'Shared',
		other: 'Shared with %(count)s'
	}
};

const t = scoped('common.components.associations.pill', DEFAULT_TEXT);

export default class AssociationPill extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			associationCount: PropTypes.number,
			getAssociations: PropTypes.func
		}).isRequired,
		scope: PropTypes.object,
		onShow: PropTypes.func,
		getString: PropTypes.func,
		className: PropTypes.string
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
