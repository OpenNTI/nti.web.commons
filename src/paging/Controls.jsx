import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';

import Button from '../components/Button';
import Text from '../text/View';
import { Chevron } from '../icons/Chevron';

const t = scoped('web-commons.paging.Controls', {
	counts: '%(current)s of %(total)s',
});

const Translated = Text.Translator(t);

const Controls = styled.div`
	display: inline-flex;
	flex-direction: row;
	align-items: center;
`;

const Count = styled(Translated.Base).attrs({ localeKey: 'counts' })`
	flex: 0 0 auto;
	font-style: italic;
	font-size: 0.75rem;
	padding-right: 0.2rem;
	text-overflow: ellipsis;
	overflow: hidden;
	max-width: 2.1rem;
`;

const Emphasis = styled.strong`
	font-weight: 600;
`;

const Arrow = styled(Button).attrs({ plain: true })`
	font-size: 2rem;
	color: var(--primary-blue);
	cursor: pointer;

	&:global(.disabled) {
		color: var(--tertiary-grey);
		pointer-events: none;
	}
`;

PagingControls.propTypes = {
	className: PropTypes.string,
	total: PropTypes.number,
	current: PropTypes.number,
	onChange: PropTypes.func,
};
export default function PagingControls({
	className,
	total,
	current,
	onChange,
}) {
	const hasPrev = current > 1;
	const hasNext = current < total;

	const onPrev = React.useCallback(() => onChange(Math.max(current - 1, 0)), [
		onChange,
		current,
	]);
	const onNext = React.useCallback(
		() => onChange(Math.min(current + 1, total)),
		[onChange, current, total]
	);

	return (
		<Controls className={className}>
			<Count
				with={{
					current: <Emphasis>{current}</Emphasis>,
					total: <Emphasis>{total}</Emphasis>,
				}}
			/>
			<Arrow
				onClick={onPrev}
				className={cx({ disabled: !hasPrev })}
				aria-label="previous page"
			>
				<Chevron.Left skinny />
			</Arrow>
			<Arrow
				onClick={onNext}
				className={cx({ disabled: !hasNext })}
				aria-label="next page"
			>
				<Chevron.Right skinny />
			</Arrow>
		</Controls>
	);
}
