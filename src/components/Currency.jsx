import React from 'react';
import Logger from 'nti-util-logger';

const logger = Logger.get('Currency');

Currency.propTypes = {
	amount: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.number,
	]).isRequired,
	omitFractional: React.PropTypes.bool
};

export default function Currency ({amount, omitFractional, ...other}) {

	const a = parseFloat(amount);

	return (
		isNaN(a) ? null : <span {...other}>{format(amount, omitFractional)}</span>
	);
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
		return Intl.NumberFormat(locale, {
			style: 'currency',
			currency: currency,
			maximumFractionDigits: omitFractional ? 0 : undefined
		}).format(amount);
	}
	// logger.warn('No browser support for Intl.NumberFormat.');
	return (omitFractional ? Math.floor(amount) : amount).toLocaleString();
}
