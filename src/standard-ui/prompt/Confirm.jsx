//TODO: update to use the Base prompt component
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

import Card from '../Card';
import Button from '../../components/Button';
import { Alert } from '../../icons';
import { Variant } from '../../HighOrderComponents';
import * as Responsive from '../../layouts/responsive';
import { Dialog } from '../../prompts';
import Text from '../../text';

import styles from './Confirm.css';

const ConfirmCard = Variant(Card, ({ onDismiss, ...props }) => ({
	as: 'section',
	rounded: true,
	...props,
}));

const t = scoped('web-commons.standard-ui.prompt.Confirm', {
	confirm: 'Confirm',
	cancel: 'Cancel',
});

const SmallSizeCutOff = 350;
const ClassList = [
	{ query: s => s.width < SmallSizeCutOff, className: styles.small },
	{ query: s => s.width >= SmallSizeCutOff, className: styles.large },
];

ConfirmPrompt.propTypes = {
	className: PropTypes.string,

	as: PropTypes.any,

	title: PropTypes.node,
	body: PropTypes.node,

	destructive: PropTypes.bool,

	onConfirm: PropTypes.func,
	confirmLabel: PropTypes.string,
	onCancel: PropTypes.func,
	cancelLabel: PropTypes.string,
};
export default function ConfirmPrompt({
	className,

	as: tag,

	title,
	body,

	destructive,

	onConfirm,
	confirmLabel,

	onCancel,
	cancelLabel,
}) {
	const Cmp = tag || Dialog;

	return (
		<Cmp>
			<Responsive.ClassList
				classList={ClassList}
				as={ConfirmCard}
				className={cx(className, styles.confirmPrompt, {
					[styles.destructive]: destructive,
				})}
			>
				<div className={styles.icon}>
					<Alert.Round className={styles.icon} />
				</div>
				<Text.Base as="h1" className={styles.title}>
					{title}
				</Text.Base>
				<div className={styles.body}>
					{typeof body === 'string' ? (
						<Text.Base>{body}</Text.Base>
					) : (
						body
					)}
				</div>
				<div className={styles.buttons}>
					{onCancel && (
						<Button
							rounded
							secondary
							className={styles.cancel}
							onClick={onCancel}
						>
							{cancelLabel ?? t('cancel')}
						</Button>
					)}
					{onConfirm && (
						<Button
							destructive={destructive}
							rounded
							className={styles.confirm}
							onClick={onConfirm}
						>
							{confirmLabel ?? t('confirm')}
						</Button>
					)}
				</div>
			</Responsive.ClassList>
		</Cmp>
	);
}
