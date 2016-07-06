import EventEmitter from 'events';
import Logger from 'nti-util-logger';

const logger = Logger.get('common:components:content-resources:tasks:TaskQueue');

const List = () => ({ value: [], writable: true });


export default class TaskQueue extends EventEmitter {

	constructor (stopOnError) {
		super();
		Object.defineProperties(this, {
			done: List(),
			queue: List(),
			stopOnError: {value: stopOnError}
		});
	}


	get running () {
		return !!this.current || !!this.previous;
	}


	get empty () {
		return this.queue.length === 0 && this.done.length === 0;
	}


	add (task) {
		const queue = this.queue.filter(x => x !== task);
		const move = this.queue.length !== queue.length;

		this.queue = [task, ...queue];

		if (!move) {
			listen(this, task);
		}


		this.schedual();
	}


	beginHalt () {
		delete this.previous;
		const falted = x => x.error || x.needsConfirmation;
		const completed = this.done.filter(x => !falted(x));
		const indeterminate = this.done.filter(falted);

		this.done = [];
		if (this.queue.length !== 0) {
			logger.warn('Unexpected state');
		}

		this.emit('finish', completed, indeterminate);
	}


	schedual () {
		if (!this.current) {
			let task = this.current = this.queue[this.queue.length - 1];
			if (!task) {
				this.beginHalt();
				return;
			}

			task.begin();
			if (!this.previous) {
				this.emit('begin');
			}
		}
	}


	onTaskProgress = (task, taskProgress, taskTotal) => {
		const count = (acc, t) => acc + t.total;
		const done = this.done.reduce(count, 0);
		const max = done + this.queue.reduce(count, 0);
		const value = done + taskProgress;

		logger.log('Progress: %o %d (%d) %d (%d)', task, taskProgress, value, taskTotal, max);
		this.emit('progress', task, value, max);
	}


	onTaskFinish = (task, error) => {
		stopListening(this, task);
		if (error) {
			try {
				this.emit('error', error);
			} catch (e) {
				logger.error('Unhandled error: %o', e.stack || e.message || e);
			}
		}

		this.queue = this.queue.filter(x => x !== task);
		this.done.push(task);

		if (this.current === task) {
			this.previous = this.current;
			delete this.current;
		}

		if (!error || !this.stopOnError) {
			this.schedual();
		}
	}
}


function stopListening (scope, task) {
	task.removeListener('progress', scope.onTaskProgress);
	task.removeListener('finish', scope.onTaskFinish);
	task.removeListener('error', scope.onTaskFinish);
}

function listen (scope, task) {
	task.addListener('progress', scope.onTaskProgress);
	task.addListener('finish', scope.onTaskFinish);
	task.addListener('error', scope.onTaskFinish);
}
