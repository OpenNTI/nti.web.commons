import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Text from '../../text';
import {Message as ErrorMessage} from '../../errors';

import styles from './LabelPlaceholder.css';


const Box = styles.box;
const Underlined = styles.underlined;

let seenIds = 0;

const getId = () => {
	seenIds += 1;

	return `nti-${seenIds}`;
};

LabelPlaceholder.Box = Box;
LabelPlaceholder.Underlined = Underlined;
LabelPlaceholder.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	error: PropTypes.any,

	locked: PropTypes.bool,
	center: PropTypes.bool,
	noError: PropTypes.bool,
	fill: PropTypes.bool,

	variant: PropTypes.oneOf([Box, Underlined]),
	as: PropTypes.string,

	children: PropTypes.element
};

export default function LabelPlaceholder ({className, variant = Box, as:tag, label, error, locked, center, noError, fill, children, ...otherProps}) {
	const [id] = React.useState(() => getId());
	const errorId = `${id}-error`;
	const input = React.Children.only(children);
	const Cmp = tag || 'div';

	const [empty, setEmpty] = React.useState();
	const inputRef = React.useRef(null);
	const inputListener = React.useCallback(e => setEmpty(!e.target.value), []);

	const clonedInputRef = component => {
		const node = component?.input ?? component;

		if(node && node instanceof HTMLInputElement && node !== inputRef.current) {
			inputRef.current = node;
			node.addEventListener('change', inputListener);
			setEmpty(!node.value);
		} else if(node == null && inputRef.current != null) {
			inputRef.current.removeEventListener('change', inputListener);
			inputRef.current = null;
		}
	};

	const containerClass = cx(
		styles.container,
		className,
		variant,
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
		<Cmp className={containerClass} data-input-id={id} {...otherProps} >
			<div className={styles.inputWrapper}>
				{React.cloneElement(input, {id, placeholder: input.props.placeholder || ' ', 'aria-describedby': errorId, ref: clonedInputRef})}
				{label && (
					<Text.Base as="label" className={styles.labelPlaceholder} htmlFor={id}>{label}</Text.Base>
				)}
				{variant === Box && label && (
					<fieldset className={styles.fieldset}>
						<legend className={styles.legend}>{label}</legend>
					</fieldset>
				)}
			</div>
			{!noError && (<ErrorMessage error={error} className={styles.errorMessage} id={errorId} role="alert" />)}
		</Cmp>
	);
}
