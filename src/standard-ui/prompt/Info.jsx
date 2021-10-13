import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Button } from '@nti/web-core';

import Card from '../Card';
import { Variant } from '../../HighOrderComponents';
import { Dialog } from '../../prompts';

const InfoCard = Variant(Card, ({ onDismiss, ...props }) => ({
	as: 'section',
	rounded: true,
	...props,
}));

const t = scoped('web-commons.standard-ui.prompt.Info', {
	done: 'Done',
});

const styles = stylesheet`
	.info-card {
		background: white;
		max-width: 500px;
		width: 98vw;
		padding: 1.5rem 0.625rem 0.875rem 1.25rem;
	}

	.buttons {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}

	.done:global(.nti-button) {
		width: 150px;
		padding-top: 1rem;
		padding-bottom: 1rem;
		text-align: center;
	}
`;

InfoPrompt.propTypes = {
	className: PropTypes.string,

	as: PropTypes.any,
	children: PropTypes.any,

	onDone: PropTypes.func.isRequired,
	doneLabel: PropTypes.string,
};
export default function InfoPrompt({
	className,

	as: tag,
	children,

	onDone,
	doneLabel = t('done'),
}) {
	const Cmp = tag || Dialog;

	return (
		<Cmp onBeforeDismiss={onDone}>
			<InfoCard className={cx(styles.infoCard, className)}>
				<div className={styles.body}>{children}</div>
				<div className={styles.buttons}>
					<Button rounded className={styles.done} onClick={onDone}>
						{doneLabel}
					</Button>
				</div>
			</InfoCard>
		</Cmp>
	);
}
