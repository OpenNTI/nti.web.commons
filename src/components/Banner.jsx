import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {DataURIs} from '../constants';
import {ItemChanges} from '../mixins';

const {BLANK_IMAGE} = DataURIs;

export default createReactClass({
	displayName: 'Content:Banner',
	mixins: [ItemChanges],

	propTypes: {
		children: PropTypes.node,
		className: PropTypes.string,

		/**
		 * @type {object} Any model that implements getPresentationProperties()
		 */
		item: PropTypes.shape({
			getPresentationProperties: PropTypes.func }).isRequired,

		preferBackground: PropTypes.bool
	},

	render () {
		const {children, className, item, preferBackground} = this.props;
		if (!item) {
			return null;
		}
		const p = item.getPresentationProperties();

		const icon = preferBackground ? (p.background || p.icon) : p.icon;

		return (
			<div className={cx('content-banner', className)}>
				<img src={icon || BLANK_IMAGE} />
				<label>
					<h3>{p.title}</h3>
					<h5>{p.label}</h5>
				</label>
				{children}
			</div>
		);
	}
});
