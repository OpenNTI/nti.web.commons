import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button, useChanges } from '@nti/web-core';

const Element = styled(Button, { allowAs: true }).attrs({ plain: true })`
	position: relative;
	display: inline-block;
	margin: 0.5rem;
	padding: 0 0 0 1.25rem;
	height: 1rem;
	width: 1.875rem;
	cursor: pointer;
	vertical-align: top;
	white-space: nowrap;
	text-overflow: clip;
	line-height: 16px;
	font-size: 0.625rem;
	font-style: italic;
	font-weight: 600;

	& > div {
		margin-left: 15px;
	}

	&::after {
		background-image: url('./assets/like.png');
		content: '';
		overflow: hidden;
		position: absolute;
		height: 13px;
		width: 14px;
		top: 0.0625rem;
		left: 0.1875rem;
	}

	&.active::after {
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
