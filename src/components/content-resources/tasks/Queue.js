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


	add (task) {
		const queue = this.queue.filter(x => x !== task);
		const move = this.queue.length !== queue.length;

		this.queue = [task, ...queue];

		if (!move) {
			listen(this, task);
		}

		this.schedual();
	}

	schedual () {
		if (!this.current) {
			let task = this.current = this.queue[this.queue.length - 1];
			if (!task) {
				this.done = [];
				if (this.queue.length !== 0) {
					logger.warn('Unexpected state');
				}
				return void this.emit('finish');
			}

			this.nextUp = task.begin();
		}
	}


	onTaskProgress = (task, progress, total) => {
		logger.log('Progress: %o %d %d', task, progress, total);
	}


	onTaskFinish = (task, error) => {
		stopListening(this, task);

		if (this.current === task) {
			this.queue = this.queue.filter(x => x !== task);
			this.done.push(task);
			delete this.current;
		}

		if (error) { this.emit('error', error); }
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
