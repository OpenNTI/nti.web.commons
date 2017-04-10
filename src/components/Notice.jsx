import React from 'react';
import PropTypes from 'prop-types';

/**
 * Whats the point of this component? why not just use the element with classname?
 * <figure class="notice">...
 */

export default React.createClass({
	displayName: 'Notice',

	propTypes: {
		className: PropTypes.string
	},


	getDefaultProps () {
		return {
			className: ''
		};
	},

	render () {
		let {className} = this.props;

		className = ['notice'].concat(className).join(' ');
		return (
			<figure {...this.props} className={className}/>
		);
	}
});
