const PartTypes = {
	Currency: 'currency',
	Group: 'group',
	Decimal: 'decimal',
	Integer: 'integer'
};

function getParts (format) {
	if (!format.formatToParts) {
		return {
			currencySymbol: '$',
			currencyIndex: 0,
			group: ',',
			decimal: '.'
		};
	}

	return format
		.formatToParts(1000.5)
		.reduce((acc, part, index) => {
			if (part.type === PartTypes.Currency) {
				acc.currencySymbol = part.value;
				acc.currencyIndex = index;
			} else if (part.type === PartTypes.Group) {
				acc.group = part.value;
			} else if (part.type === PartTypes.Decimal) {
				acc.decimal = part.value;
			}

			return acc;
		}, {});
}

export default function getIntlFormatInfo (currency, locale) {
	const format = new Intl.NumberFormat(locale, {style: 'currency', currency});
	const options = format.resolvedOptions();
	const parts = getParts(format);

	return {
		format: x => format.format(x),
		...parts,
		...options
	};
}