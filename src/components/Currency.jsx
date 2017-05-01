import React from 'react';
import PropTypes from 'prop-types';
import Logger from 'nti-util-logger';

const logger = Logger.get('Currency');


export default class Currency extends React.PureComponent {

	static propTypes = {
		amount: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]).isRequired,
		omitFractional: PropTypes.bool
	}

	render () {

		const {amount, omitFractional, ...other} = this.props;

		const a = parseFloat(amount);

		return (
			isNaN(a) ? null : <span {...other}>{format(amount, omitFractional)}</span>
		);
	}
}

(function () {
	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
		if(!supports()) {
			logger.warn('No browser support for Intl.NumberFormat. Adding polyfill.');
			const el = document.createElement('script');
			el.src = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en';
			el.defer = true;
			el.async = true;
			el.setAttribute('data-script-added-by', 'nti-web-commons:Currency');
			document.getElementsByTagName('body')[0].appendChild(el);
		}
	}
}());

function supports () {
	return typeof Intl === 'object' && Intl && typeof Intl.NumberFormat === 'function';
}

function format (amount, omitFractional, locale = 'en-US', currency = 'USD') {
	if (supports()) {

		const options = {
			style: 'currency',
			currency: currency,
		};

		if (omitFractional) {
			Object.assign(options, {
				maximumFractionDigits: 0,
				// in Safari (desktop and mobile), setting maximumFractionDigits without setting minimumFractionDigits
				// causes format() to throw a RangeError ('maximumFractionDigits is out of range')
				minimumFractionDigits: 0
			});
		}

		return Intl.NumberFormat(locale, options).format(amount);
	}
	// logger.warn('No browser support for Intl.NumberFormat.');
	return (omitFractional ? Math.floor(amount) : amount).toLocaleString();
}
