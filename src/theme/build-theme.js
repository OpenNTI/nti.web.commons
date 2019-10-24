const DefaultsProperties = {
	library: {
		background: 'dark',
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
	}
};


export default function BuildTheme (properties = DefaultsProperties, initialValues = {}) {
	const theme = {};
	
	let values = {...initialValues};

	const getValue = (scopes = [], key) => {
		let pointer = values;

		for (let scope of scopes) {
			pointer = pointer[scope];

			if (!pointer) { return null; }
		}

		return pointer[key];
	};
	
	theme.getValues = () => values;
	//TODO: merge overrides onto any existing values...
	theme.setOverrides = overrides => values = ({...overrides});
	theme.scope = (scope) => BuildTheme(properties[scope], values[scope]);

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
							return value(themeScope, values);
						}

						return value;
					}
				});
			}
		}

		return themeScope;
	};

	return apply(properties, theme, []);
}