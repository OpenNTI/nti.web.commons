import React from 'react';

import {Layouts} from '../../src/';

const TIMEOUTS = [
	100,
	500,
	3000,
	1000
];

const HEIGHTS = [
	'100px',
	'50px',
	'500px',
	'100vh',
	'250px'
];

const COLORS = [
	'orange',
	'red',
	'green',
	'blue',
	'yellow',
	'pink'
];

export default class InfiniteScrollTest extends React.Component {
	state = {items: []}

	addItem = () => {
		setTimeout(() => {
			const {items} = this.state;
			const item = items.length + 1;
			const height = HEIGHTS[Math.floor(Math.random() * HEIGHTS.length)];
			const color = COLORS[Math.floor(Math.random() * COLORS.length)];

			this.setState({
				items: [
					...items,
					{
						height,
						color,
						text: item
					}
				]
			});

		}, TIMEOUTS[Math.floor(Math.random() * TIMEOUTS.length)]);
	}

	render () {
		const {items} = this.state;

		return (
			<Layouts.InfiniteScroll.Continuous loadMore={this.addItem} buffer={500}>
				{items.map(i => this.renderItem(i))}
			</Layouts.InfiniteScroll.Continuous>
		);
	}


	renderItem (item) {
		const {height, color, text} = item;
		const style = {
			fontSize: '2rem',
			color: 'white',
			width: '100vw',
			height,
			backgroundColor: color,
			borderBottom: '1px solid black'
		};

		return (
			<div style={style} key={text}>{text}</div>
		);
	}
}