import React from 'react';
import NavigatableMixin from '../mixins/NavigatableMixin';
import cx from 'classnames';


//This is duplicating "./ActiveState"

export default React.createClass({
	displayName: 'ActiveLink',

	mixins: [NavigatableMixin],

	propTypes: {
		href: React.PropTypes.string,
		className: React.PropTypes.string,
		children: React.PropTypes.any
	},

	componentWillMount () {
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
