import React from 'react';
import cx from 'classnames';

import { Card as StandardCard } from '../../standard-ui';
import Image from '../../image';
import { Asset } from '../../presentation-assets';
import { useListItemVariant } from '../../hooks';
import Text from '../../text';

export default styled(Card)`
	background: white;
	padding: 5px;
	height: 305px;
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

const Title = styled(Text).attrs({ as: 'h2' })`
	font: normal 700 1rem/1.3 var(--header-font-family);
	display: block;
	color: var(--primary-grey);
	text-transform: uppercase;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;

	@media (--respond-to-handhelds) {
		margin-bottom: 5px;
		white-space: normal;
	}

	&.variant-list-item {
		margin-bottom: 0.5rem;
		margin-top: 0.25rem;
	}
`;

const TokenList = ({ tokens = [], ...other }) =>
	!tokens.length ? null : (
		<ul {...other}>
			{tokens.map(item => (
				<li key={item}>
					<Text.Label>{item}</Text.Label>
				</li>
			))}
		</ul>
	);

const Meta = styled(TokenList)`
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	color: var(--tertiary-grey, #b8b8b8);

	> * {
		margin-right: 5px;
		margin-top: 2px;
	}
`;

const InfoContainer = styled('div')`
	padding: 0 5px;
`;

const Byline = styled('div')`
	font: normal 700 0.625rem/1.4 var(--body-font-family);
	color: var(--primary-blue);
	text-transform: uppercase;
`;

const metadata = ['SAMPL-1001', 'January 2021'];

function Card({ resource, variant: v, className, ...other }) {
	const variant = useListItemVariant(v);

	return (
		<StandardCard className={cx(variant, className)} {...other}>
			<ImgContainer>
				<Asset contentPackage={resource} type="landing">
					<Image.Deferred alt="" />
				</Asset>
			</ImgContainer>
			<InfoContainer>
				<Meta tokens={metadata} />
				<Title>This is the title</Title>
				<Byline>test 1, test 2, test 3</Byline>
			</InfoContainer>
		</StandardCard>
	);
}
