const OnlyDigits = /^[0-9]+$/;
//https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
const escapeRegExp = x => x.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
const getRegExp = (x, flags) => new RegExp(escapeRegExp(x), flags);

export function getDisplayFromAmount (amount, intlInfo) {
	if (amount == null) { return ''; }

	return intlInfo.format(amount / 100);
}

export function getAmountFromDisplay (display, intlInfo) {
	if (!display) { return null; }

	const mask = getMaskFromDisplay(display, intlInfo);
	const clean = (`${display}${mask}`)
		.replace(getRegExp(intlInfo.group, 'g'), '')
		.replace(getRegExp(intlInfo.decimal), '');

	return parseInt(clean, 10);
}

export function getMaskFromDisplay (display, intlInfo) {
	if (!display) { return ''; }

	const [integer, fraction] = display.split(intlInfo.decimal);

	let mask = '';

	const groups = integer?.split(intlInfo.group);
	const lastGroup = groups && groups[groups.length - 1];

	if (groups && groups.length > 1 && lastGroup.length < 3) {
		mask += ('0').repeat(3 - lastGroup.length);
	}

	const minFraction = intlInfo.minimumFractionDigits;

	if (fraction == null) {
		mask += `.${('0').repeat(minFraction)}`;
	} else if (fraction.length < minFraction) {
		mask += ('0').repeat(minFraction - fraction.length);
	}

	return mask;
}

export function isValidIntermeddiateDisplay (display, intlInfo) {
	if (!display) { return true; }

	const [integer, fraction, extra] = display.split(intlInfo.decimal);

	if (extra != null) { return false; }
	if (fraction && fraction.length > intlInfo.maximumFractionDigits) { return false; }
	if (fraction && fraction.indexOf(intlInfo.group) >= 0) { return false; }
	if (fraction && !OnlyDigits.test(fraction)) { return false; }

	if (!integer) { return false; }
	if (integer && integer.charAt(0) === '0' && integer.length > 1) { return false; }

	const groups = integer?.split(intlInfo.group);
	const middle = groups.slice(1, -1);

	for (let group of middle) {
		if (group.length !== 3) { return false; }
	}

	return groups.every(group => !group || OnlyDigits.test(group));
}

export function insertGroupSeparators (display, intlInfo, force) {
	if (!display) { return display; }

	const [integer, fraction] = display.split(intlInfo.decimal);
	const groups = integer.split(intlInfo.group);
	const needsFixing = force || groups.some(group => group.length > 3);

	if (!needsFixing) {	return display;	}

	const digits = integer.split('').filter(d => d !== intlInfo.group).reverse();
	const separatedDigits = [];

	for (let i = 0; i < digits.length; i++) {
		const digit = digits[i];

		if (i !== 0 && i % 3 === 0) {
			separatedDigits.push(intlInfo.group);
		}

		separatedDigits.push(digit);
	}

	const separated = separatedDigits.reverse().join('');

	return fraction != null ? `${separated}${intlInfo.decimal}${fraction}` : separated;
}

export function fixDisplay (display, intlInfo) {
	const mask = getMaskFromDisplay(display, intlInfo);

	return insertGroupSeparators(`${display}${mask}`, intlInfo, true);
}