import EventEmitter from 'events';
import Logger from 'nti-util-logger';

const logger = Logger.get('common:components:content-resources:tasks:Task');

const value = x => ({value: x});

export default class Task extends EventEmitter {

	/**
	 * Setup a file task.
	 *
	 * @param  {function} callback - the callback to start the work.
	 * @param  {number} units - number of units represented by this task.
	 * @param  {function} [onComplete] - Optional callback when the task completes.
	 * @return {void}
	 */
	constructor (callback, units, onComplete) {
		super();
		Object.defineProperties(this, {
			executer: value(callback),
			total: value(units),
			onComplete: value(onComplete)
		});
	}


	begin = () => (this.fiberId = setTimeout(this.worker, 0))


	worker = () => {
		const {executer :start} = this;

		try {
			const result = start(this);
			if (result && result.then && result.catch) {
				result
					.catch(e => this.emitError(e))
					//force finish to have no arguments
					.then(()=> this.finish());
			} else {
				this.finish();
			}
		} catch (e) {
			this.emitError(e);
		}
	}


	finish () {
		const {onComplete} = this;
		if (typeof onComplete === 'function' && !this.error) {
			try {
				onComplete();
			} catch (e) {
				logger.error(e.stack || e.message || e);
			}
		}

		this.finished = true;
		this.emitProgress(this.total, this.total);
		this.emit('finish', this);
	}


	emitProgress = (current, total) => (
		this.current = current,
		this.emit('progress', this, current, total)
	)


	emitError = (e) => (
		this.finished = this.error = e,
		this.emit('error', this, e)
	)
}
