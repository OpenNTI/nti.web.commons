import * as srcsetUtils from '../srcset';

function getAttempt(src, srcset, fallback) {
	if (Array.isArray(src) && !srcset) {
		srcset = src;
		src = null;
	}

	if (!src && !srcset && !fallback) {
		return null;
	}
	if (!src && !srcset) {
		return { src: fallback, getNextAttempt: () => getAttempt() };
	}
	if (!srcset) {
		return { src, getNextAttempt: () => getAttempt(null, null, fallback) };
	}

	return {
		src,
		srcset: srcsetUtils.toAttribute(srcset),
		getNextAttempt: () => getAttempt(src, null, fallback),
	};
}

function isCrossOrigin(attempt) {
	if (!attempt.src) {
		return false;
	}
	if (
		attempt.src.startsWith('http') ||
		attempt.src.startsWith('data:image')
	) {
		return true;
	}

	return false;
}

function tryAttempt(attempt) {
	return new Promise((fulfill, reject) => {
		const loader = new Image();

		if (isCrossOrigin(attempt)) {
			loader.crossOrigin = 'anonymous';
		}

		const onLoad = e => (cleanupListeners(), fulfill(loader));
		const onError = e => (cleanupListeners(), reject(e));

		function cleanupListeners() {
			loader.removeEventListener('load', onLoad);
			loader.removeEventListener('error', onError);
		}

		loader.addEventListener('load', onLoad);
		loader.addEventListener('error', onError);

		if (attempt.srcset != null && 'srcset' in loader) {
			loader.srcset = attempt.srcset;
		} else {
			loader.src = attempt.src;
		}
	});
}

export default async function resolveImage(src, srcset, fallback) {
	let attempt = getAttempt(src, srcset, fallback);

	while (attempt) {
		try {
			const image = await tryAttempt(attempt);

			return image;
		} catch (e) {
			attempt = attempt.getNextAttempt(e);
		}
	}

	throw new Error('Unable to load Image.');
}
