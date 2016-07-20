import Registry from './Registry';

/*
 * Mount this component to enable the Conflict Resolver Subsystem.
 */
export Component from './components/Resolver';

/*
 * If you only want to hook behavior and want the default appearance, use this component as your modal body.
 */
export DefaultConfirmPrompt from './components/DefaultConfirmPrompt';

/**
 * @callback responder
 * @param {Object} challenge - the conflict challenge response.
 * @returns {*} If handled, a truthy value. If the return value is a
 *                 Promise it will be used to prolong the existing promise chain.
 */

/**
 * Register a responder for an error code.
 *
 * @param  {string} code - the error code.
 * @param  {Responder} responder - a responder's callback.
 * @return {void}
 */
export function registerHandler (code, responder) {
	Registry.register(code, responder);
}

/**
 * Remove a responder from the Registry.
 *
 * @param  {string} code - the error code.
 * @param  {Responder} responder - a responder's callback.
 * @return {void}
 */
export function unregisterHandler (code, responder) {
	Registry.unregister(code, responder);
}
