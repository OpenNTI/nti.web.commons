import merge from 'merge';

const DefaultsProperties = {
	library: {
		background: 'light',
		navigation: {
			backgroundColor: '#3FB34F', //'rgba(255, 255, 255, 0.97)',
			search: (values) => {
				//TODO: if the navigation background is set, derive light or dark here based off the color
				return 'dark';
			},
			icon: (values) => {
				//TODO: if the navigation background is set, derive light or dark here based off the color
				return 'dark';
			},
			identity: {
				presence: (values) => {
					//TODO: base this off of the backgroundColor of the navigation
					return 'light';
				}
			}
		}
	},
	brandName: 'NextThought',
	brandColor: null,
	assets: {}
};

const Scope = Symbol('Scope');
const Parent = Symbol('Parent');

export default function BuildTheme (properties = DefaultsProperties, internalConfig = {}) {
	const theme = {};
	const parentTheme = internalConfig[Parent];
	const initialScope = internalConfig[Scope] || [];
	
	let values = {};

	const getValue = (scopes = [], key) => {
		let pointer = theme.getValues();

		for (let scope of scopes) {
			pointer = pointer[scope];

			if (!pointer) { return null; }
		}

		return pointer[key];
	};
	
	theme.getValues = () => parentTheme ? parentTheme.getValues() : values;
	theme.setOverrides = overrides => values = merge.recursive(values, {...overrides});
	theme.scope = (scope) => BuildTheme(properties[scope], {[Scope]: [...initialScope, scope], [Parent]: theme});

	const apply = (props, themeScope, valueScope) => {
		for (let [key, value] of Object.entries(props)) {
			if (value != null && typeof value === 'object') {
				Object.defineProperty(themeScope, key, {
					value: apply(value, {}, [...valueScope, key])
				});
			} else {
				Object.defineProperty(themeScope, key, {
					get: () => {
						const defined = getValue(valueScope, key);

						if (defined != null) { return defined; }

						if (typeof value === 'function') {
							return value(themeScope, theme.getValues());
						}

						return value;
					}
				});
			}
		}

		return themeScope;
	};

	return apply(properties, theme, initialScope);
}