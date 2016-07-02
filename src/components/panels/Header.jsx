import React from 'react';
import cx from 'classnames';

import isActionable from 'nti-commons/lib/is-event-actionable';

export default class Header extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		children: React.PropTypes.any,
		onClose: React.PropTypes.func
	}

	onClose = (e) => {
		const {onClose} = this.props;
		if (onClose && isActionable(e)) {
			onClose(e);
		}
	}

	render () {
		const {children, className, onClose, ...otherProps} = this.props;

		return (
			<div {...otherProps} className={cx('panel-header-component', className)}>
				{children}
				{onClose && (
					<i className="icon-light-x"
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


export function TitleBalencer () {
	return <span className="balencer"/>;
}
