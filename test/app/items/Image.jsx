import React from 'react';

import {Image} from '../../../src';

const SRC = 'https://picsum.photos/200/300';
const BAD_SRC = 'https://thisdoesntexistimeanhowcoulditijustmadeitup.com/image.png';

function getBackground (src) {
	return {
		style: {
			backgroundImage: `url(${src})`,
			backgroundSize: 'cover',
			width: '200px',
			height: '200px'
		},
	};
}

export default function ImageTest () {
	return (
		<div>
			<input />
			<Image src={SRC} fallback={BAD_SRC} alt="Test Image" aspectRatio={Image.AspectRatios.Square} letterbox="black" childProps={getBackground}>
				<div className="test-background-image" />
			</Image>
			<br />
			<h2>Light Box:</h2>
			<Image.LightBox trigger={(<Image src={SRC} />)}>
				<Image src={SRC} />
			</Image.LightBox>
		</div>
	);
}