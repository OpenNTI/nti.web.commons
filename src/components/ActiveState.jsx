import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';


import {child as ActiveStateBehavior} from '../mixins/ActiveStateSelector';

export default createReactClass({
	displayName: 'ActiveState',
	mixins: [ActiveStateBehavior],

	propTypes: {
		activeClassName: PropTypes.string,
		className: PropTypes.string,
		hasChildren: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.shape({
				test: PropTypes.func.isRequired
			})
		]),
		href: PropTypes.string,
		link: PropTypes.bool, //force onClick handler for non-'a' tags
		tag: PropTypes.any,
		onClick: PropTypes.func
	},


	getDefaultProps () {
		return {
			tag: 'span',
			activeClassName: 'active'
		};
	},


	render () {
		const {props: {tag: Element, className, activeClassName, href, link, ...props}} = this;

		delete props.hasChildren;

		Object.assign(props, {
			className: cx(className, {
				[activeClassName]: this.isActive()
			}),

			href: href && this.makeHref(href)
		});

		if (Element === 'a' || link) {
			props.onClick = this.onClick;
		}

		return <Element {...props}/>;
	},


	onClick (e) {
		const {onClick} = this.props;
		if (onClick && (onClick(e) === false || e.defaultPrevented)) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		this.navigate(this.props.href);
	}
});
