import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';

import { FillToBottom, List } from '../components/';
import Text from '../text';

import Styles from './Card.css';

const cx = classnames.bind(Styles);
const t = scoped('common.not-found.Card', {
	header: "Sorry, this page doesn't exist...",
	description:
		'Your link may contain errors or this page may no longer exist.',
	options: {
		back: 'Previous Page',
	},
});

NotFoundCard.optionLabels = {
	back: t('options.back'),
};
NotFoundCard.propTypes = {
	className: PropTypes.string,
	header: PropTypes.string,
	description: PropTypes.string,
	fillToBottom: PropTypes.bool,
	options: PropTypes.node,
};
export default function NotFoundCard({
	className,
	header,
	description,
	fillToBottom,
	options,
	...otherProps
}) {
	let content = (
		<div className={cx('not-found')}>
			<i className={cx('icon-alert', 'icon')} />
			<div className={cx('message')}>
				<Text.Base className={cx('header')}>
					{header || t('header')}
				</Text.Base>
				<Text.Base className={cx('description')}>
					{description || t('description')}
				</Text.Base>
				{options && (
					<List.SeparatedInline className={cx('options')}>
						{options}
					</List.SeparatedInline>
				)}
			</div>
		</div>
	);

	if (fillToBottom) {
		content = <FillToBottom>{content}</FillToBottom>;
	}

	return (
		<div className={cx('not-found-card', className)} {...otherProps}>
			{content}
		</div>
	);
}
