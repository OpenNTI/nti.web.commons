import Logger from 'nti-util-logger';

const logger = Logger.get('common:utils:mergeRefHandlers');

const REF_HANDLERS = new WeakMap();


export default function mergeRefHandlers (parentRef, localRef) {
	if (typeof parentRef !== 'function') {
		if (parentRef) {
			logger.error(`${parentRef} ref has been overridden... To prevent set the ref using a function`);
		}

		return localRef;
	}

	let h = REF_HANDLERS.get(parentRef);

	if (!h) {
		h = (x) => {parentRef(x); localRef(x);};
		REF_HANDLERS.set(parentRef, h);
	}

	return h;
}


export function setRefOnProps (props, ref) {
	return {...props, ref: mergeRefHandlers(props.ref, ref)};
}
