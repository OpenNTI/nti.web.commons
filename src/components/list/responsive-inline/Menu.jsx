import './Menu.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class ResponsiveInlineListMenu extends React.Component {
	static propTypes = {
		hidden: PropTypes.bool,
		items: PropTypes.array,
		onDismiss: PropTypes.func,
		addTriggerClass: PropTypes.func,
		removeTriggerClass: PropTypes.func,
	};

	onDismiss = () => {
		const { onDismiss } = this.props;

		if (onDismiss) {
			onDismiss();
		}
	};

	render() {
		const {
			items,
			hidden,
			addTriggerClass,
			removeTriggerClass,
		} = this.props;

		return (
			<ul
				className={cx('nti-responsive-inline-list-menu', { hidden })}
				aria-hidden={hidden}
				hidden={hidden}
			>
				{items.map((item, index) => (
					<li key={index}>
						{React.cloneElement(item, {
							onDismiss: this.onDismiss,
							addTriggerClass: addTriggerClass,
							removeTriggerClass: removeTriggerClass,
						})}
					</li>
				))}
			</ul>
		);
	}
}
