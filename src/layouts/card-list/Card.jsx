import React from 'react';

import { Card as StandardCard } from '../../standard-ui';
import Image from '../../image';
import { Asset } from '../../presentation-assets';

export default styled(Card)`
	background: white;
	padding: 5px;
`;

const ImgContainer = styled('div')`
	width: 100%;
	height: 0;
	padding-bottom: 73.2758621%;
	position: relative;
	overflow: hidden;

	> * {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		object-fit: cover;
	}
`;

function Card({ resource, ...other }) {
	return (
		<StandardCard {...other}>
			<ImgContainer>
				<Asset contentPackage={resource} type="landing">
					<Image.Deferred alt="" />
				</Asset>
			</ImgContainer>
		</StandardCard>
	);
}
