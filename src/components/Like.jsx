import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button, useChanges } from '@nti/web-core';

const Element = styled(Button).attrs({ plain: true })`
	[data-button-label] {
		margin: 0.5rem;
		padding-right: 4px;
		height: 1rem;
		white-space: nowrap;
		line-height: 1.6;
		font-size: 0.625rem;
		font-style: italic;
		font-weight: 600;

		&::before {
			display: inline-block;
			background-image: url('./assets/like.png');
			content: '';
			overflow: hidden;
			height: 13px;
			width: 14px;
			margin-right: 4px;
			vertical-align: sub;
		}
	}

	&.active [data-button-label]::before {
		background-image: url('./assets/like_active.png');
	}
`;

Like.propTypes = {
	item: PropTypes.object.isRequired,
};

export default function Like({ item, ...props }) {
	useChanges(item);

	const onClick = e => {
		e?.preventDefault();
		e?.stopPropagation();
		item?.like();
	};

	const count = item.LikeCount || '';

	return (
		<Element
			{...props}
			className={cx('like', {
				count: !!count,
			})}
			onClick={onClick}
			active={item?.hasLink('unlike')}
		>
			{count}
		</Element>
	);
}
