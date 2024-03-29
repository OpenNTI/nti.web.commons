import { getService } from '@nti/web-client';

import Task from './Task';

/** @typedef {import('@nti/lib-interfaces').Models.content.File} File */
/** @typedef {import('@nti/lib-interfaces').Models.content.Folder} Folder */

const ensureEntity = e =>
	Object.getPrototypeOf(e) === Object.getPrototypeOf({})
		? getService().then(s => s.getObject(e))
		: Promise.resolve(e);

export default class Move extends Task {
	/**
	 * Move the entity to the path
	 *
	 * @param  {File} data - file object. Either the raw json, or the instance.
	 * @param  {Folder} target - Folder instance to move to.
	 * @param  {(result: any) => void} [onComplete] - Optional callback for when the task completes
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
