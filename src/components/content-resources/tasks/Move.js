import { getService } from '@nti/web-client';

import Task from './Task';

const ensureEntity = e =>
	Object.getPrototypeOf(e) === Object.getPrototypeOf({})
		? getService().then(s => s.getObject(e))
		: Promise.resolve(e);

export default class Move extends Task {
	/**
	 * Move the entity to the path
	 *
	 * @param  {Object} data - file object. Either the raw json, or the instance.
	 * @param  {Folder} target - Folder instance to move to.
	 * @param  {Function} [onComplete] - Optional callback for when the task completes
	 * @returns {void}
	 */
	constructor(data, target, onComplete) {
		super(() => this.performMove(data, target.getPath()), 1, onComplete);
		this.needsConfirmation = true;
		this.verb = 'move';
		this.folder = target;
		this.filename = data.filename;
	}

	performMove = (entity, path) =>
		ensureEntity(entity).then(e => e.moveTo(path));
}
