import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';

import NavigatableMixin from '../mixins/NavigatableMixin';


//This is duplicating "./ActiveState"

export default createReactClass({
	displayName: 'ActiveLink',

	mixins: [NavigatableMixin],

	propTypes: {
		href: PropTypes.string,
		className: PropTypes.string,
		children: PropTypes.any
	},

	componentDidMount () {
		console.warn('ActiveLink component is deprecated. Use ActiveState instead.'); //eslint-disable-line no-console
	},

	isActive () {
		let {href} = this.props;
		let path = this.getPath();
		try {
			path = this.context.router.getMatch().matchedPath;
			return path === href;
		} catch (e) {
			//don't care
		}

		return path.indexOf(href) === 0;
	},

	render () {
		const {context: {routerLinkComponent: Link = 'a'}, props: {className}} = this;

		return (
			<Link {...this.props} className={cx(className, {active: this.isActive()})}/>
		);
	}

});
