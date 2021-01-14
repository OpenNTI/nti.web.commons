import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Relative from './Relative';

const styles = css`
@custom-selector :--inputs input:not([type="checkbox"]);
@custom-selector :--box-up-state .box.locked :--inputs, .box:not(.empty) :--inputs, .box :--inputs:focus;
@custom-selector :--box-error-up-state .box.error.locked :--inputs, .box.error:not(.empty) :--inputs, .box.error :--inputs:focus;

.box.box {
	margin-top: calc(var(--text-smaller, 0.875rem) / 2);

	--padding-horizontal: 0.625rem;

	label[data-placeholder] {
		display: none;
	}

	:--inputs {
		width: 100%;
		border-radius: 2px;
		padding: var(--padding-horizontal, 0.625rem);
	}

	&.fill :--inputs {
		background: var(--panel-background);
	}

	&.unlabeled :--inputs ~ fieldset {
		top: 0;
	}
}

.box :--inputs ~ fieldset {
	position: absolute;
	top: calc(var(--padding-horizontal, 0.625rem) * -1);
	bottom: 0;
	left: 0;
	right: 0;
	padding: 0;
	border: var(--border, 1px solid) transparent;
	margin: 0;
	border-radius: 2px;
	pointer-events: none;

	& > legend {
		/* Using margin prevents the fieldset top-left corner being cut off */
		padding: 0 calc(var(--padding-horizontal, 0.625rem) - 0.375rem);
		margin-left: 0.375rem;
		font-size: 1em;
		color: var(--tertiary-grey);
		transition:
			font-size var(--transition-time, 0.2s),
			transform var(--transition-time, 0.2s);
		pointer-events: none;
	}
}

.box:not(.locked).empty :--inputs:not(:focus) {
	/* Boo !important but we need to override some mobile styles */
	border-color: var(--border-grey-light) !important;

	& ~ fieldset > legend {
		transform: translateY(calc(50% + var(--padding-horizontal, 0.625rem)));
	}
}

:--box-up-state ~ fieldset {
	border-color: var(--secondary-green);

	& > legend {
		top: -0.7rem;
		color: var(--secondary-green);
		font-size: var(--text-smaller, 0.875rem);
		transform: none;
	}
}

.box :--inputs:-webkit-autofill ~ fieldset {
	border-color: var(--border-grey-light);

	& > legend {
		top: -0.7rem;
		font-size: var(--text-smaller, 0.875rem);
		transform: none;
	}
}

.box.error {
	&:not(.locked).empty :--inputs:not(:focus) {
		border-color: var(--primary-red);
	}

	& :--inputs:-webkit-autofill ~ fieldset {
		border-color: var(--primary-red);

		& > legend {
			color: var(--primary-red);
		}
	}
}

:--box-error-up-state ~ fieldset {
	border-color: var(--primary-red);

	& > legend {
		color: var(--primary-red);
	}
}
`;

BoxFrame.propTypes = {
	as: PropTypes.any,
	center: PropTypes.bool,
	label: PropTypes.any,
	error: PropTypes.any,
	empty: PropTypes.bool,
	fill: PropTypes.bool,
	locked: PropTypes.bool,
};
export default function BoxFrame ({
	as = 'div',
	center,
	children,
	className,
	empty,
	error,
	fill,
	label,
	locked,
	...props
}) {
	const Cmp = as;
	const cls = cx(
		styles.box,
		className,
		{
			[styles.error]: error,
			[styles.locked]: locked,
			[styles.center]: center,
			[styles.fill]: fill,
			[styles.empty]: empty,
			[styles.unlabeled]: !label
		}
	);

	return (
		<Cmp className={cls} {...props} >
			<Relative>
				{children}
				{label && (
					<fieldset>
						<legend>{label}</legend>
					</fieldset>
				)}
			</Relative>
			{error}
		</Cmp>
	);
}
