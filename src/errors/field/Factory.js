import {EventEmitter} from 'events';

function getMessageForReason (reason, overrides) {
	const code = reason.ErrorCode;

	//TODO: fill this out more
	if (overrides[code]) {
		return overrides[code];
	}

	return (reason && reason.message) || 'Unknown Error';
}

class FieldError extends EventEmitter {
	constructor (id, obj, field, message, reason, onClear) {
		super();

		this.onClear = onClear;

		this.data = {
			id,
			NTIID: obj.NTIID || obj,
			field,
			message,
			reason
		};
	}


	get ID () {
		return this.data.id;
	}


	get NTIID () {
		return this.data.NTIID;
	}


	get field () {
		return this.data.field;
	}


	get message () {
		return this.data.message;
	}


	get reason () {
		return this.data.reason;
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

}

export default class Factory {
	constructor (config = {}) {
		this.overrides = config.overrides || {};
		this.seenCount = 0;
	}


	make (obj, field, reason, onClear) {
		this.seenCount += 1;
		return new FieldError (this.seenCount, obj, field, getMessageForReason(reason, this.overrides), reason, onClear);
	}
}
