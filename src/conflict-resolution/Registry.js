/** @typedef {number|string} Code */

/**
 * @typedef {object} ConfirmationOptions
 * @property {string?} [rel="confirm"] Name of link on Challenge to post to.
 * @property {any} [data] Optional additional data to post with confirmation
 */

/**
 * @typedef {object} Link
 * @property {string} rel
 * @property {string} href
 */

/**
 * the conflict challenge response
 *
 * @typedef {object} Challenge
 * @property {Code} code
 * @property {Link[]} Links
 * @property {string?} Message
 * @property {(confirmationOptions: ConfirmationOptions?) => void} confirm
 * @property {() => void} reject
 */

/**
 * @typedef {Promise<void> | true} Acknowledge
 */

/**
 * If handled, a truthy value. If the return value is a Promise it will be used to prolong the existing promise chain.
 *
 * @typedef {(challenge: Challenge) => Acknowledge?} Responder
 */

/**
 * Singltion instance maintains custom handlers for conflict resolution.
 */
export default new (class Registry {
	/**
	 * Maps error codes to a list of responders.
	 *
	 * @type {Record<Code, Responder>}
	 */
	handlers = {};

	/**
	 * Attempts to handle the challenge response.
	 *
	 * If there exists more than one handler per code, last one registered responds first.
	 * First one to response/handle wins. Not all responders are guaranteed to get called.
	 *
	 * @param  {Challenge} challenge - The challenge body.
	 * @returns {Promise<void>?} If handled, a Promise, otherwise void.
	 */
	handleConflict(challenge) {
		const { code } = challenge || {};
		const handlers = code && this.handlers[code];
		if (!handlers) {
			return;
		}

		for (let handler of handlers) {
			let handled = handler(challenge);
			if (handled) {
				return handled.then ? handled : Promise.resolve(handled);
			}
		}
	}

	/**
	 * Register a responder for an error code.
	 *
	 * @param  {string} code - the error code.
	 * @param  {Responder} responder - a responder's callback.
	 * @param  {boolean} [prepend=true] - register the handler as a first responder or a last responder
	 * @returns {void}
	 */
	register(code, responder, prepend = true) {
		if (!code) {
			throw new TypeError('An error code to handle is required');
		}

		const handlers = (this.handlers[code] = this.handlers[code] || []);

		if (!handlers.includes(responder)) {
			if (prepend) {
				handlers.unshift(responder); //first responder
			} else {
				handlers.push(responder);
			}
		}
	}

	/**
	 * Remove a responder from the Registry.
	 *
	 * @param  {string} code - the error code.
	 * @param  {Responder} responder - a responder's callback.
	 * @returns {void}
	 */
	unregister(code, responder) {
		if (!code) {
			throw new TypeError('An error code is required');
		}

		const handlers = (this.handlers[code] = this.handlers[code] || []);

		const index = handlers.indexOf(responder);
		if (index >= 0) {
			//remove
			handlers.splice(index, 1);
		}
	}
})();
