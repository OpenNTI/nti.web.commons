import React from 'react';

import {Image} from '../../src';

const SRC = 'https://picsum.photos/200/300';
const BAD_SRC = 'https://thisdoesntexistimeanhowcoulditijustmadeitup.com/image.png';

export default function ImageTest () {
	return (
		<Image src={SRC} fallback={BAD_SRC} alt="Test Image" aspectRatio={Image.AspectRatios.Square} letterbox="black" />
	);
}