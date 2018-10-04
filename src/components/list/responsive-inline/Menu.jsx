import React from 'react';
import PropTypes from 'prop-types';

export default class ReponsiveInlineListMenu extends React.Component {
	static propTypes = {
		items: PropTypes.array,
		onDismiss: PropTypes.func
	}


	onDismiss = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}

	render () {
		const {items} = this.props;

		return (
			<ul className="nti-responsive-inline-list-menu">
				{items.map((item, index) => {

					return (
						<li key={index}>
							{React.cloneElement(item, {onDismiss: this.onDimiss})}
						</li>
					);
				})}
			</ul>
		);
	}
}
