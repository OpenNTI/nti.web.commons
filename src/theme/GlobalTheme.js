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

	theme.setOverrides(overrides, true);
};

//This should probably live in the apps, but we need it in both web and mobile.
//This is just a convenient place to stick it for now
export const siteBrandToTheme = (siteBrand) => {
	const {assets} = siteBrand || {};

	return {
		...((siteBrand || {}).theme || {}),
		brandName: siteBrand['brand_name'],
		brandColor: siteBrand['brand_color'],
		certificateCompletionLabel: siteBrand['certificate_label'],
		certificateBrandColor: siteBrand['certificate_brand_color'],
		surpressCertificateLogo: siteBrand['suppress_certificate_logo'],
		HideNextThoughtBranding: siteBrand.HideNextThoughtBranding,
		assets: assets ? {...assets, fullLogo: assets['full_logo']} : null 
	};
};
