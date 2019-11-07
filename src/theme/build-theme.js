import merge from 'merge';
import {Color} from '@nti/lib-commons';

import Fallbacks from './fallback-assets';

const DefaultLogo = '/site-assets/shared/brand_web.png';
const makeAssetHREFFallbacks = (defaultAsset) => {
	return (_, globalTheme) => {
		const logoHref = globalTheme.assets.logo.href;

		if (logoHref && logoHref !== DefaultLogo) {
			return logoHref;
		}

		return defaultAsset;
	};
};
 
const DefaultProperties = {
	library: {
		background: 'dark',
		navigation: {
			branding: (_, globalTheme) => globalTheme.assets.fullLogo,
			backgroundColor: (_, globalTheme) => globalTheme.brandColor || '#2A2A2A',
			search: (values) => {
				try {
					const {brightness} = Color(values.backgroundColor).hsv;

					return brightness <= 0.2 ? 'light' : 'dark';
				} catch (e) {
					return 'dark';
				}
			},
			icon: (values) => {
				try {
					const {brightness} = Color(values.backgroundColor).hsv;

					return brightness >= 0.8 ? 'dark' : 'light';
				} catch (e) {
					return 'light';
				}
			},
			identity: {
				presence: (_, globalTheme) => {
					try {
						const {saturation, brightness} = Color(globalTheme.library.navigation.backgroundColor).hsv;

						return saturation === 0 && (brightness <= 0.3 || brightness >= 0.9) ? 'dark' : 'light';
					} catch (e) {
						return 'light';
					}
				}
			}
		}
	},
	brandName: 'NextThought',
	brandColor: null,//'#3FB34F',
	assets: {
		logo: {
			filename: '',
			alt: 'logo',
			fallback: Fallbacks.Logo,
			fill: (_, globalTheme) => globalTheme.brandColor,
			href: DefaultLogo
		},
		fullLogo: {
			filename: '',
			alt: 'logo',
			fallback: Fallbacks.FullLogo,
			fill: (_, globalTheme) => globalTheme.brandColor,
			href: makeAssetHREFFallbacks('/site-assets/shared/brand_web_library.png')
		},
		email: {
			filename: '',
			alt: 'email',
			fallback: Fallbacks.Email,
			href: makeAssetHREFFallbacks(Fallbacks.Email)
		},
		favicon: {
			filename: '',
			alt: 'favicon',
			fallback: Fallbacks.Favicon,
			href: makeAssetHREFFallbacks('/favicon.ico')
		}
	}
};

const Scope = Symbol('Scope');
const Parent = Symbol('Parent');

BuildTheme.makeAssetHREFFallbacks = makeAssetHREFFallbacks;
BuildTheme.DefaultProperties = DefaultProperties;
export default function BuildTheme (properties = DefaultProperties, internalConfig = {}) {
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
	
	theme.getRoot = () => parentTheme ? parentTheme.getRoot() : theme;
	theme.getParent = () => parentTheme;
	theme.getScope = () => initialScope;
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
							return value(themeScope, theme.getRoot());
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