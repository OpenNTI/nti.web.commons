import React from 'react';

import DeferredImage from '../DeferredImage';

const SIZE = 300;

export default {
	title: 'DeferredImage',
	component: DeferredImage,
	argTypes: {
		src: {control: {type: 'string'}},
	}
};

function Container (props) {
	return (
		<div
			style={{
				maxHeight: '100vh',
				height: `${SIZE}px`,
				overflow: 'auto'
			}}
			{...props}
		/>
	);
}

const ballpark = () => SIZE + (Math.floor(Math.random() * 100) - 50);

export const Story = ({length = 100, ...props}) => (
	<Container>
		{
			Array.from({length}, (_, i) => (
				<DeferredImage
					key={i}
					width={SIZE}
					height={SIZE}
					src={`//placekitten.com/${ballpark()}/${ballpark()}`}
					{...props}
				/>
			))
		}
	</Container>
);
