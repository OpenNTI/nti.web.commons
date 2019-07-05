/**
 * A decorator to predefine different combinations
 * of props and wrappers.
 *
 * ex.
 * {
 * 	VariantName: function (Cmp) { return (<Cmp customProps />); }
 * }
 * @param {Object} variants variants to apply to the Component
 * @returns {Function} decorator
 */
export default function WithVariants (variants) {
	return (Component) => {
		const names = Object.keys(variants);

		for (let name of names) {
			const fn = variants[name];

			Component[name] = fn(Component);
		}

		return Component;
	};
}