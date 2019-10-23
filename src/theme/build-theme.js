const DefaultsProperties = {
	library: {
		background: 'dark',
		'navigation': {
			'background-color': '#fff',
			'search': (values) => {
				//TODO: if the navigation background is set, derive light or dark here based off the color
				return 'dark';
			},
			'icon': (values) => {
				//TODO: if the navigation background is set, derive light or dark here based off the color
				return 'dark';
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

	const setValue = (scopes = [], key, value) => {
		let pointer = values;

		for (let scope of scopes) {
			if (!pointer[scope]) { pointer[scope] = {}; }

			pointer = pointer[scope];
		}

		pointer[key] = value;
	};
	
	theme.clone = () => BuildTheme(properties, values);
	theme.setOverrides = overrides => values = ({...overrides});
	theme.getValues = () => values;

	const apply = (props, themeScope, valueScope) => {
		for (let [key, value] of Object.entries(props)) {
			if (typeof value === 'object') {
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
					},
					set: (newValue) => {
						setValue(valueScope, key, newValue);
					}
				});
			}
		}

		return themeScope;
	};

	return apply(properties, theme, []);
}