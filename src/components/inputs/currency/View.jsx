import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import TextInput from '../Text';

import Styles from './Styles.css';
import {
	getIntlFormatInfo,
	getDisplayFromAmount,
	getAmountFromDisplay,
	getMaskFromDisplay,
	isValidIntermeddiateDisplay,
	insertGroupSeparators,
	fixDisplay,
} from './utils';

const cx = classnames.bind(Styles);

CurrencyInput.propTypes = {
	className: PropTypes.string,

	amount: PropTypes.number,
	currency: PropTypes.string,
	locale: PropTypes.string,
	omitFractional: PropTypes.bool,
	max: PropTypes.number,

	onChange: PropTypes.func,
};
export default function CurrencyInput({
	className,
	amount,
	currency = 'USD',
	locale = 'en-US',
	max = Infinity,
	omitFractional,
	onChange: onChangeProp,
	...otherProps
}) {
	const intlInfo = React.useMemo(
		() => getIntlFormatInfo(currency, locale, omitFractional),
		[currency, locale, omitFractional]
	);

	const value = React.useRef(null);
	const [display, setDisplay] = React.useState(null);
	const mask = getMaskFromDisplay(display, intlInfo);

	React.useEffect(() => {
		if (amount !== value.current) {
			value.current = amount;
			setDisplay(getDisplayFromAmount(amount, intlInfo));
		}
	}, [amount]);

	const onChange = (inputValue, e) => {
		if (!isValidIntermeddiateDisplay(inputValue, intlInfo)) {
			return;
		}

		const backspaced = inputValue < display;
		const nextDisplay =
			e.target.selectionEnd === inputValue.length
				? insertGroupSeparators(inputValue, intlInfo, backspaced)
				: inputValue;
		const nextValue = getAmountFromDisplay(nextDisplay, intlInfo);

		if (nextValue > max) {
			return;
		}

		const changed = value.current !== nextValue;

		value.current = nextValue;
		setDisplay(nextDisplay);

		if (onChangeProp && changed) {
			onChangeProp(nextValue, currency);
		}
	};

	const onBlur = () => {
		const fixed = fixDisplay(display, intlInfo);

		if (fixed !== display) {
			setDisplay(fixed);
		}
	};

	return (
		<div className={cx('nti-currency-input', className)}>
			<TextInput
				className={cx('nti-currency-mask')}
				value={`${display || ''}${mask}`}
				readOnly
				autoComplete="off"
				aria-hidden="true"
			/>
			<TextInput
				className={cx('nti-currency-input')}
				value={display}
				onChange={onChange}
				onBlur={onBlur}
				{...otherProps}
			/>
			{intlInfo && (
				<div className={cx('nti-currency-symbol')} aria-hidden="true">
					{intlInfo.currencySymbol}
				</div>
			)}
			{intlInfo && (
				<div className={cx('nti-currency')} aria-hidden="true">
					{intlInfo.currency}
				</div>
			)}
		</div>
	);
}
