import React from 'react';
import isEmpty from 'isempty';

export default React.createClass({
	displayName: 'Loading',

	propTypes: {
		maskScreen: React.PropTypes.bool,
		loading: React.PropTypes.bool,
		message: React.PropTypes.string,
		tag: React.PropTypes.string,

		children: React.PropTypes.any
	},


	getDefaultProps () {
		return {
			tag: 'div',
			message: 'Loading'
		};
	},


	render () {
		const {tag: Tag, children, loading, maskScreen, message, ...otherProps} = this.props;

		if (!isEmpty(children) && !loading) {
			return <Tag {...otherProps}/>;
		}

		return (
			<Mask mask={maskScreen}>
				<figure className="loading">
					<div className="m spinner"></div>
					<figcaption>{message}</figcaption>
				</figure>
			</Mask>
		);
	}
});


Mask.propTypes = {
	children: React.PropTypes.element,
	mask: React.PropTypes.bool
};
function Mask (props) {
	const {children, mask} = props;
	return mask ? ( <div className="mask-loader">{children}</div> ) : children;
}
