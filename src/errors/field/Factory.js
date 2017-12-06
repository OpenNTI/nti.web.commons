import EventEmitter from 'events';

const DATA = Symbol('Data');

function getMessageForReason (reason, overrides) {
	const {ErrorCode: code} = reason || {};
	const override = overrides[code];

	if (typeof override === 'function') {
		return override(reason);
	}

	if (override) {
		return override;
	}


	return (reason && reason.message) || 'Unknown Error';
}

class FieldError extends EventEmitter {
	/**
	 * Creates a FieldError.
	 *
	 * attachedTo is an object that looks like:
	 * {
	 * 		NTIID: String, //The object the error is on
	 * 		Field: String, //The field on the object the error is on
	 * 		Label: String, //User facing string describing what the error is on
	 * }
	 * @param  {String} id      identifier for the error
	 * @param  {Object} attachedTo      what the error is on
	 * @param  {String} message user facing message
	 * @param  {Object} raw     the raw response from the server
	 * @param  {Function} onClear callback for when the error is cleared
	 * @return {void}
	 */
	constructor (id, attachedTo, message, raw, onClear) {
		super();

		this.onClear = onClear;

		this[DATA] = {
			id,
			attachedTo,
			message,
			raw
		};
	}


	get ID () {
		return this[DATA].id;
	}

	get raw () {
		return this[DATA].raw;
	}


	get attachedTo () {
		return this[DATA].attachedTo;
	}


	get doNotShow () {
		return this.raw.doNotShow;
	}


	set attachedTo (value) {
		this[DATA].attachedTo = value;
		this.emit('changed');
	}


	get message () {
		return this[DATA].message;
	}


	set message (value) {
		this[DATA].message = value;
		this.emit('changed');
	}


	clear () {
		this.emit('clear');

		if (this.onClear) {
			this.onClear();
		}
	}


	focus () {
		this.emit('focus');
	}


	isAttachedTo (ntiid, field) {
		const {attachedTo} = this;

		//Is attached to the same NTIID, and if field is passed it is the same
		return attachedTo.NTIID === ntiid && (field != null ? field === attachedTo.field : true);
	}


	isAttachedToField (field) {
		const {attachedTo} = this;

		return attachedTo.field === field;
	}
}

export default class Factory {
	constructor (config = {}) {
		this.overrides = config.overrides || {};
		this.seenCount = 0;
	}

	/**
	 * Create a FieldError.
	 * @param  {Object} attachedTo  describes what the error is on. See comment on FieldError's constructor
	 * @param  {Object} reason  describes what the error is (i.e. the server's error response)
	 * @param  {Function} onClear what to do when the error is cleared
	 * @return {[type]}         [description]
	 */
	make (attachedTo, reason, onClear) {
		this.seenCount += 1;

		const message = getMessageForReason(reason, this.overrides);

		return new FieldError (this.seenCount, attachedTo, message, reason, onClear);
	}
}
