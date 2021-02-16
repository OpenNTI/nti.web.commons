/**
 * Singltion instance maintains custom handlers for conflict resolution.
 */
export default new (class Registry {
	/**
	 * Maps error codes to a list of responders.
	 * @type {Object}
	 */
	handlers = {};

	/**
	 * Attempts to handle the challenge response.
	 *
	 * If there exists more than one handler per code, last one registered responds first.
	 * First one to response/handle wins. Not all responders are garunteed to get called.
	 *
	 * @param  {Object} challenge - The challenge body.
	 * @param  {Object} challenge.code - The error code for the challenge.
	 * @returns {Promise|void} If handled, a Promise, otherwise void.
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
