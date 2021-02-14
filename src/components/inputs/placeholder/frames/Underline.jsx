import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Relative from './Relative';

const styles = css`
@custom-selector :--inputs input:not([type="checkbox"]);
@custom-selector :--underline-up-state .underline.locked :--inputs, .underline:not(.empty) :--inputs, .underline :--inputs:focus;
@custom-selector :--underline-error-up-state .underline.error.locked :--inputs, .underline.error:not(.empty) :--inputs, .underline.error :--inputs:focus;


.center label {
	left: 0;
	right: 0;
	text-align: center;
}

.fill.fill {
	--input-padding-left: 0.625rem;
	--input-padding-right: 0.625rem;

	:--inputs {
		background: #f7f7f7;
		border-radius: 5px 5px 0 0;
	}
}

.underline.underline :--inputs {
	appearance: none;
	-webkit-appearance: none;
	width: 100%;
	box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.4);
	padding: 1.5625em var(--input-padding-right, 0.625rem) 0.625rem var(--input-padding-left, 0.625rem);
	background: none;

	& + label {
		position: absolute;
		left: var(--input-padding-left, 0.625rem);
		font-size: 1em;
		color: var(--tertiary-grey);
		transition:
			top var(--transition-time, 0.2s),
			font-size var(--transition-time, 0.2s),
			transform var(--transition-time, 0.2s);
		pointer-events: none;
	}

	:--inputs:-webkit-autofill + label {
		top: 0.25rem;
		font-size: var(--text-smaller, 0.875rem);
		transform: none;
	}
}

.underline:not(.locked).empty :--inputs:not(:focus) + label {
	top: 50%;
	transform: translateY(-50%);
}

:--underline-up-state {
	&:focus {
		box-shadow: inset 0 -1px 0 0 var(--secondary-green);

		& + label {
			color: var(--secondary-green);
		}
	}


	& + label {
		top: 0.25rem;
		font-size: var(--text-smaller, 0.875rem);
		transform: none;
	}
}

.underline.error {
	&:not(.locked).empty :--inputs:not(:focus) {
		box-shadow: inset 0 -1px 0 0 var(--primary-red);
	}

	:--inputs:-webkit-autofill + label {
		color: var(--primary-red);
	}
}

:--underline-error-up-state + label {
	color: var(--primary-red);
}

`;

UnderlineFrame.propTypes = {
	as: PropTypes.any,
	center: PropTypes.bool,
	label: PropTypes.any,
	error: PropTypes.any,
	errorCmp:PropTypes.any,
	empty: PropTypes.bool,
	fill: PropTypes.bool,
	locked: PropTypes.bool,
};
export default function UnderlineFrame ({
	as = 'div',
	center,
	children,
	className,
	empty,
	error,
	errorCmp,
	fill,
	label,
	locked,
	...props
}) {
	const Cmp = as;
	const cls = cx(
		styles.underline,
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
			</Relative>
			{errorCmp}
		</Cmp>
	);
}
