export default function optionMatchesTerm (option, term) {
	const {value, matches} = option.props;

	if (matches) { return matches(value, term); }

	return value.toLowerCase().indexOf(term.toLowerCase()) === 0;
}
