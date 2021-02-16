import './Header.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Events } from '@nti/lib-commons';

export default class Header extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		onClose: PropTypes.func,
	};

	onClose = e => {
		const { onClose } = this.props;
		if (onClose && Events.isActionable(e)) {
			onClose(e);
		}
	};

	render() {
		const { children, className, onClose, ...otherProps } = this.props;

		return (
			<div
				{...otherProps}
				className={cx('panel-header-component', className)}
			>
				{children}
				{onClose && (
					<i
						className="icon-light-x"
						role="button"
						label="Close"
						title="Close"
						tabIndex="0"
						onClick={this.onClose}
						onKeyDown={this.onClose}
					/>
				)}
			</div>
		);
	}
}

export function TitleBalancer() {
	return <span className="balancer" />;
}
