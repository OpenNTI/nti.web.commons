function getValue (value) {
	if (typeof value !== 'string') { return value.toString(); }

	return value;
}

export default function optionMatchesTerm (option, term) {
	const {value, matches} = option.props;

	if (matches) { return matches(value, term); }

	return getValue(value).toLowerCase().indexOf(term.toLowerCase()) === 0;
}
