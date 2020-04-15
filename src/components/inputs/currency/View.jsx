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
	fixDisplay
} from './utils';

const cx = classnames.bind(Styles);


CurrencyInput.propTypes = {
	className: PropTypes.string,

	amount: PropTypes.number,
	currency: PropTypes.string,
	locale: PropTypes.string,

	onChange: PropTypes.func
};
export default function CurrencyInput ({amount, currency = 'USD', locale = 'en-US', onChange:onChangeProp, ...otherProps}) {
	const intlInfo = React.useMemo(() => getIntlFormatInfo(currency, locale), [currency]);

	const value = React.useRef(null);
	const [display, setDisplay] = React.useState(null);
	const mask = getMaskFromDisplay(display, intlInfo);

	React.useEffect(() => {
		if (amount !== value.current) {
			value.current = amount;
			setDisplay(getDisplayFromAmount(amount, intlInfo));
		}
	}, [amount]);

	const onChange = (nextDisplay, e) => {
		if (!isValidIntermeddiateDisplay(nextDisplay, intlInfo)) { return; }

		const nextValue = getAmountFromDisplay(nextDisplay, intlInfo);
		const changed = value.current !== nextValue;
		const backspaced = nextDisplay < display;

		value.current = nextValue;
		setDisplay(
			e.target.selectionEnd === nextDisplay.length ?
				insertGroupSeparators(nextDisplay, intlInfo, backspaced) :
				nextDisplay
		);

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
		<div className={cx('nti-currency-input')}>
			{intlInfo && (
				<div className={cx('nti-currency-symbol')} aria-hidden="true">
					{intlInfo.currencySymbol}
				</div>
			)}
			<TextInput value={display} onChange={onChange} onBlur={onBlur} {...otherProps} />
			<div className={cx('nti-currency-mask')} aria-hidden="true">
				<span className={cx('display')}>{display}</span>
				<span className={cx('mask')}>{mask}</span>
			</div>
		</div>
	);
}