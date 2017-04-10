import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'isempty';

export default class extends React.Component {
	static displayName = 'LoadingMask';

	static propTypes = {
		maskScreen: PropTypes.bool,
		loading: PropTypes.bool,
		message: PropTypes.string,
		tag: PropTypes.string,

		children: PropTypes.any
	};

	static defaultProps = {
		tag: 'div',
		message: 'Loading'
	};

	render () {
		const {tag: Tag, children, loading, maskScreen, message, ...otherProps} = this.props;

		if (!isEmpty(children) && !loading) {
			return <Tag {...otherProps}>{children}</Tag>;
		}

		return (
			<Mask mask={maskScreen}>
				<figure className="loading">
					<div className="m spinner" />
					<figcaption>{message}</figcaption>
				</figure>
			</Mask>
		);
	}
}


Mask.propTypes = {
	children: PropTypes.element,
	mask: PropTypes.bool
};
function Mask (props) {
	const {children, mask} = props;
	return mask ? ( <div className="mask-loader">{children}</div> ) : children;
}
