import EventEmitter from 'events';

const PRESENCE_MAP = Symbol('Presence Map');

function isSamePresence(a, b) {
	const fields = ['username', 'type', 'show', 'status'];

	for (let field of fields) {
		if (a[field] !== b[field]) {
			return false;
		}
	}

	return true;
}

export default class PresenceStore extends EventEmitter {
	constructor() {
		super();
		this.setMaxListeners(0);

		this[PRESENCE_MAP] = {};
	}

	setPresenceFor(username, presenceInfo) {
		const oldPresence = this[PRESENCE_MAP][username];

		this[PRESENCE_MAP][username] = presenceInfo;

		if (!oldPresence || !isSamePresence(oldPresence, presenceInfo)) {
			this.emit('presence-changed', username, presenceInfo);
		}
	}

	getPresence(user) {
		const username = user && user.getID ? user.getID() : user;

		return username ? this[PRESENCE_MAP][username] : null;
	}
}
