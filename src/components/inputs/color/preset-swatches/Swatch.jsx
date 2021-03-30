import React from 'react';
import PropTypes from 'prop-types';

const stop = e => (e.preventDefault(), e.stopPropagation());

const SwatchBase = styled('a').attrs({
	className: 'nti-color-swatch',
	tabIndex: '0',
	role: 'button',
})`
	display: inline-block;
	cursor: pointer;
	width: 38px;
	height: 38px;
	border-radius: 38px;
	box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3);

	&:focus {
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3),
			0 0 3px 1px var(--primary-blue);
	}

	&.selected {
		transform: scale(1.2);
	}
`;
export default class Swatch extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		swatch: PropTypes.shape({
			color: PropTypes.shape({
				rgb: PropTypes.shape({
					toString: PropTypes.func,
				}),
			}).isRequired,
			title: PropTypes.string,
		}).isRequired,
		selected: PropTypes.bool,
		onSelect: PropTypes.func,
	};

	select() {
		const { swatch, onSelect } = this.props;

		if (onSelect) {
			onSelect(swatch.color);
		}
	}

	onClick = e => {
		stop(e);
		this.select();
	};

	onKeyPress = e => {
		if (e.key === 'Enter') {
			stop(e);
			this.select();
		}
	};

	render() {
		const { swatch, ...props } = this.props;
		const { color, title } = swatch;

		return (
			<SwatchBase
				{...props}
				title={title}
				onClick={this.onClick}
				onKeyPress={this.onKeyPress}
				style={{
					backgroundColor: `${color.rgb}`,
				}}
			/>
		);
	}
}
