import React from 'react';

const BadgeList = styled('ul')`
	list-style: none;
	padding: 5px;
	margin: 0;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;

	.icon-clock-archive {
		margin-right: 3px;
		margin-left: -3px;
	}

	.icon-clock-archive::before {
		color: white;
	}

	li {
		flex: 0 0 auto;
	}

	.warning {
		/* background-image: url(../../assets/warning.svg); */
		height: 16px;
		width: 16px;
		margin-right: 5px;
	}
`;

const Badges = ({ badges, ...other }) =>
	!badges?.length ? null : (
		<BadgeList>
			{badges.map((badge, key) => {
				return <li key={key}>{badge}</li>;
			})}
		</BadgeList>
	);

export default Badges;
