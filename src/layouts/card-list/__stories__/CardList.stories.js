import React from 'react';

import Card from '../Card';
import CardList from '../View';
import grid from '../../grid';

export default {
	title: 'Card List',
	component: CardList,
};

const Grid = grid(242, 14);

export const CardGrid = () => {
	return (
		<Grid>
			{Array.from({ length: 12 }, (_, i) => (
				<Card key={i}>{i}</Card>
			))}
		</Grid>
	);
};
