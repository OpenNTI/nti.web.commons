import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import Card from '../Card';
import {Button} from '../../components';
import {Alert} from '../../icons';
import Text from '../../text';

import Styles from './Confirm.css';

console.log('BUTTON!!!!!!!!! ', Button);//eslint-disable-line

const t = scoped('web-commons.standard-ui.prompt.Confirm', {
	confirm: 'Confirm',
	cancel: 'Cancel'
});

ConfirmPrompt.propTypes = {
	className: PropTypes.string,

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

	title,
	body,

	destructive,

	onConfirm,
	confirmLabel,

	onCancel,
	cancelLabel
}) {


	return (
		<Card rounded className={cx(className, Styles.confirmPrompt, {[Styles.destructive]: destructive})} as="section">
			<Alert className={Styles.icon} />
			<Text.Base as="h1" className={Styles.title}>{title}</Text.Base>
			<div className={Styles.body}>
				{typeof body === 'string' ? (<Text.Base>{body}</Text.Base>) : body}
			</div>
			<div className={Styles.buttons}>
				{onCancel && (
					<Button
						plain
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
		</Card>
	);
}
