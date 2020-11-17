import React from 'react';
import Storage from '@nti/web-storage';

const normalizeConfig = (config) => {
	const initial = config?.initial ?? config;
	const expireIn = config?.expireIn ?? Infinity;

	return {
		initial,
		expireIn
	};
};

const getValue = (key, {initial, expireIn}) => {
	let value = Storage.getItem(key);

	if (expireIn < Infinity) { value = Storage.decodeExpiryValue(value); }

	return value ?? initial;
};

const setValue = (key, newValue, {expireIn}) => {
	let value = newValue;

	if (expireIn < Infinity) {
		value = Storage.encodeExpiryValue(value, new Date(Date.now() + expireIn));
	}

	Storage.setItem(
		key,
		value
	);
};


export default function usePersistentState (key, configArg) {
	const config = normalizeConfig(configArg);
	const [value, setStateValue] = React.useState(getValue(key, config));

	React.useEffect(() => {
		const handler = (e) => {
			if (e.key === key) {
				setStateValue(getValue(key, configArg));
			}
		};

		Storage.addListener('change', handler);

		return () => (
			Storage.removeListener('change', handler)
		);
	}, [key]);

	return [
		value,
		(newValue) => setValue(key, newValue, config)
	];
}
