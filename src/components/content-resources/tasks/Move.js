import {getService} from 'nti-web-client';

import Task from './Task';

const ensureEntity = (e) =>
	Object.getPrototypeOf(e) === Object.getPrototypeOf({})
		? getService().then(s => s.getObject(e))
		: Promise.resolve(e);


export default class Move extends Task {

	/**
	 * Move the entity to the path
	 *
	 * @param  {object} data - file object. Either the raw json, or the instance.
	 * @param  {string} path - Path to move to.
	 * @param  {function} [onComplete] - Optional callback for when the task completes
	 * @return {void}
	 */
	constructor (data, path, onComplete) {
		super(()=> this.performMove(data, path), 1, onComplete);
		this.verb = 'move';
		this.filename = data.filename;
	}


	performMove = (entity, path) =>
		ensureEntity(entity)
			.then(e => e.moveTo(path))
}
