import React from 'react';

import Card from '../Card';
import Badge from '../Badge';
import CardList from '../View';
import grid from '../../grid';

export default {
	title: 'Card List',
	component: CardList,
};

const Grid = grid(242, 14);

const badgeVariants = ['green', 'blue', 'grey', 'black', 'orange', 'white'];

const getVariant = (index = 0) => badgeVariants[index % badgeVariants.length];

const badges = Array.from({ length: 3 }, (_, i) => (
	<Badge {...{ [getVariant(i)]: true }} key={i}>
		Badge {i}
	</Badge>
));

export const CardGrid = () => {
	return (
		<Grid>
			{Array.from({ length: 12 }, (_, i) => (
				<Card badges={badges} key={i} />
			))}
		</Grid>
	);
};
