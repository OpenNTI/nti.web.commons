function maybeAddConfig(embedLink, config) {
	if (!config) {
		return embedLink;
	}

	const configKeys = Object.keys(config);

	for (let i = 0; i < configKeys.length; i++) {
		const prefix = i === 0 ? '#' : '&';
		const key = configKeys[i];
		const value = config[key];

		embedLink = `${embedLink}${prefix}${key}=${value}`;
	}

	return embedLink;
}

function maybeAddFormat(embedLink, format) {
	return format
		? `${embedLink}?format=${encodeURIComponent(format)}`
		: embedLink;
}

export default function getEmbedLink(src, config, format) {
	let embedLink = src;

	embedLink = maybeAddFormat(embedLink, format);

	return maybeAddConfig(embedLink, config);
}
