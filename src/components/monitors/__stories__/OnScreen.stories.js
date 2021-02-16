import React from 'react';
import PropTypes from 'prop-types';

import OnScreen from '../OnScreen';

export default {
	title: 'Monitors/On Screen',
	component: OnScreen,
	argTypes: {
		buffer: { type: 'number', min: 0, step: 1 },
	},
};

Tile.propTypes = {
	buffer: PropTypes.number,
};
function Tile({ buffer }) {
	const [onScreen, setOnScreen] = React.useState();

	const styles = {
		width: '33vw',
		height: '33vh',
		background: onScreen ? 'green' : 'red',
	};

	return (
		<OnScreen style={styles} onChange={setOnScreen} buffer={buffer}>
			{onScreen ? 'On Screen' : 'Off Screen'}
		</OnScreen>
	);
}

const Tiles = Array.from({ length: 30 });

export const Base = ({ buffer }) => {
	const styles = {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: '198vw',
	};

	return (
		<div style={styles}>
			{Tiles.map((_, i) => (
				<Tile key={i} buffer={buffer} />
			))}
		</div>
	);
};

Base.propTypes = {
	buffer: PropTypes.number,
};
