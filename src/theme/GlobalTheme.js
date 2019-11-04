import buildTheme from './build-theme';

let globalTheme = null;

export const getGlobalTheme = () => {
	if (!globalTheme) {
		globalTheme = buildTheme();
	}

	return globalTheme;
};

export const setGlobalThemeOverrides = (overrides) => {
	const theme = getGlobalTheme();

	theme.setOverrides(overrides);
};

//This should probably live in the apps, but we need it in both web and mobile.
//This is just a convenient place to stick it for now
export const siteBrandToTheme = (siteBrand) => {
	return {
		...(siteBrand.theme || {}),
		brandName: siteBrand['brand_name'],
		brandColor: siteBrand['brand_color'],
		assets: siteBrand.assets ? {...siteBrand.assets, 'fullLogo': siteBrand['full_logo']} : siteBrand.assets
	};
};
