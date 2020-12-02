import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import Card from '../Card';
import Button from '../../components/Button';
import {Alert} from '../../icons';
import {Variant} from '../../HighOrderComponents';
import * as Responsive from '../../layouts/responsive';
import {Dialog} from '../../prompts';
import Text from '../../text';

import Styles from './Confirm.css';

const ConfirmCard = Variant(Card, {as: 'section', rounded: true});

const t = scoped('web-commons.standard-ui.prompt.Confirm', {
	confirm: 'Confirm',
	cancel: 'Cancel'
});

const SmallSizeCutOff = 350;
const ClassList = [
	{query: s => s.width < SmallSizeCutOff, className: Styles.small},
	{query: s => s.width >= SmallSizeCutOff, className: Styles.large}
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
	cancelLabel: PropTypes.string
};
export default function ConfirmPrompt ({
	className,

	as:tag,

	title,
	body,

	destructive,

	onConfirm,
	confirmLabel,

	onCancel,
	cancelLabel
}) {
	const Cmp = tag || Dialog;

	return (
		<Cmp>
			<Responsive.ClassList
				classList={ClassList}
				as={ConfirmCard}
				className={cx(className, Styles.confirmPrompt, {[Styles.destructive]: destructive})}
			>
				<div className={Styles.icon}>
					<Alert.Round className={Styles.icon} />
				</div>
				<Text.Base as="h1" className={Styles.title}>{title}</Text.Base>
				<div className={Styles.body}>
					{typeof body === 'string' ? (<Text.Base>{body}</Text.Base>) : body}
				</div>
				<div className={Styles.buttons}>
					{onCancel && (
						<Button
							rounded
							secondary
							className={Styles.cancel}
							onClick={onCancel}
						>
							{cancelLabel ?? t('cancel')}
						</Button>
					)}
					{onConfirm && (
						<Button
							destructive={destructive}
							rounded
							className={Styles.confirm}
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
