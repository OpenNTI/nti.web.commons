import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

import Card from '../Card';
import Button from '../../components/Button';
import { useMediaQuery } from '../../hooks/use-media-query';
import * as Responsive from '../../layouts/responsive';
import Dialog from '../../prompts/Dialog';

const t = scoped('web-commons.standard-ui.prompt.Confirm', {
	cancel: 'Cancel',
	done: 'Done',
});

const styles = stylesheet`
	.prompt {
		position: relative;
	}

	.prompt:not(.inline) {
		min-width: min(500px, 98vw);
		background: white;
		border-radius: 4px;
	}

	.prompt.large {
		padding: 1.5rem 0.625rem 0.875rem;
	}

	.buttons {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: wrap;
	}

	.cancel:global(.nti-button) {
		text-align: center;
		background: none;
	}

	.action {
		text-align: center;
	}

	.large .action {
		min-width: 150px;
	}
	.action.destructive {
		background-color: var(--primary-red);
	}
	.action.constructive {
		background-color: var(--secondary-green);
	}
	.action.dismissive {
		background-color: var(--primary-blue);
	}

	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;

const SmallCutOff = 350;
const classList = [
	{ query: s => s.width < SmallCutOff, className: styles.small },
	{ query: s => s.width >= SmallCutOff, className: styles.large },
];

const Destructive = 'destructive';
const Constructive = 'constructive';
const Dismissive = 'dismissive';

BasePrompt.propTypes = {
	className: PropTypes.string,

	as: PropTypes.any,
	inline: PropTypes.bool,

	children: PropTypes.any,

	onAction: PropTypes.func.isRequired,
	actionLabel: PropTypes.string,
	actionType: PropTypes.oneOf([Destructive, Constructive, Dismissive]),
	actionCmp: PropTypes.any,
	actionHref: PropTypes.string,

	onCancel: PropTypes.func,
	cancelLabel: PropTypes.string,

	mask: PropTypes.oneOf(
		PropTypes.node,
		PropTypes.bool
	)
};
export default function BasePrompt({
	className,

	as: tag,
	inline,

	children,

	onAction,
	actionLabel,
	actionType = 'dismissive',
	actionCmp,
	actionHref,

	onCancel,
	cancelLabel,

	mask,

	...otherProps
}) {
	const { matches: isMobile } = useMediaQuery('mobile');
	const isFullscreen = !inline && isMobile;

	const isMasked = Boolean(mask);

	const isDestructive = actionType === Destructive;
	const isConstructive = actionType === Constructive;
	const isDismissive = !isDestructive && !isConstructive;

	const cmp = tag || 'section';
	const extraProps = typeof cmp === 'string' ? {} : otherProps;

	const actionProps = {};

	if (actionHref) {
		actionProps.href = actionHref;
		actionProps.rel = 'noopener noreferrer';
		actionProps.target = '_blank';
	}

	let content = (
		<Responsive.ClassList
			as={tag || 'section'}
			classList={classList}
			className={cx(styles.prompt, className, 'nti-prompt', {
				[styles.fullscreen]: isFullscreen,
				[styles.inline]: inline,
			})}
			{...extraProps}
		>
			<div className={styles.content}>{children}</div>
			<div className={styles.buttons}>
				{onCancel && (
					<Button
						rounded
						secondary
						className={styles.cancel}
						onClick={onCancel}
						disabled={isMasked}
					>
						{cancelLabel ?? t('cancel')}
					</Button>
				)}
				<Button
					{...actionProps}
					rounded
					as={actionCmp}
					onClick={onAction}
					disabled={isMasked}
					className={cx(styles.action, {
						[styles.destructive]: isDestructive,
						[styles.constructive]: isConstructive,
						[styles.dismissive]: isDismissive,
					})}
				>
					{actionLabel ?? t('done')}
				</Button>
			</div>
			{isMasked && (
				<div className={styles.mask}>
					{mask !== true ? mask : null}
				</div>
			)}
		</Responsive.ClassList>
	);

	if (inline) {
		return content;
	}

	return (
		<Dialog onBeforeDismiss={onCancel}>
			<Card rounded>{content}</Card>
		</Dialog>
	);
}
