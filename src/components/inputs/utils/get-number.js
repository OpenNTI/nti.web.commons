function buildSeparators () {
	const numberWithBoth = 1000.5;
	const separators = numberWithBoth.toLocaleString().replace(/\d/g, '').split('');

	return {
		thousands: separators[0],
		decimal: separators[1]
	};
}


function getSeperatorsFn () {
	let separators;

	return () => {
		if (!separators) {
			separators = buildSeparators();
		}

		return separators;
	};
}


const getSeperators = getSeperatorsFn();

const clean = (s) => {
	const seperators = getSeperators();

	return typeof s !== 'string' ? s : s.replace(new RegExp(seperators.thousands, 'g'), '').replace(seperators.decimal, '.');
};


export default function getNumber (n) {
	if (typeof n === 'number') { return n; }

	const number = parseFloat(clean(n), 10);

	return isNaN(number) ? null : number;
}
