import './Report.scss';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import {areYouSure} from '../prompts/';
import ItemChanges from '../mixins/ItemChanges';

const DEFAULT_TEXT = {
	flag: 'Report',
	flagged: 'Reported',
};

const t = scoped('common.components.buttons', DEFAULT_TEXT);

export default createReactClass({
	displayName: 'ReportLink',
	mixins: [ItemChanges],

	propTypes: {
		icon: PropTypes.bool,
		label: PropTypes.bool,
		item: PropTypes.object.isRequired,

		className: PropTypes.string
	},


	getDefaultProps () {
		return {
			label: true
		};
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		areYouSure('Report this as inappropriate?').then(
			()=> {
				this.props.item.flag();
			},
			()=> {}
		);
	},

	render () {
		const {className, icon, item, label} = this.props;
		const isReported = item.hasLink('flag.metoo');

		return (
			<a className={cx(className, { flagged: isReported })} onClick={this.onClick}>
				{icon && ( <i className="icon-flag"/> )}
				{label && t(isReported ? 'flagged' : 'flag')}
			</a>
		);
	}

});
