import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class LoadingSpinner extends React.PureComponent {
	static Large = (props) => {
		return (<LoadingSpinner {...props} size="100px" strokeWidth="2" />);
	}

	static propTypes = {
		white: PropTypes.bool,
		blue: PropTypes.bool,
		grey: PropTypes.bool,
		size: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number
		]),
		strokeWidth: PropTypes.string,
		className: PropTypes.string
	}

	render () {
		const {className, white, grey, size = '25px', strokeWidth = '5'} = this.props;
		const cls = cx('loading-spinner', className, {white, grey, blue: !white && !grey});

		return (
			<div className={cls} style={{width: size}}>
				<svg className="circular" viewBox="25 25 50 50">
					<circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth={strokeWidth} strokeMiterlimit="10"/>
				</svg>
			</div>
		);
	}
}
