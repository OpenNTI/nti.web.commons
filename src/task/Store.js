import { Stores } from '@nti/lib-store';

export default class TaskStore extends Stores.BoundStore {
	load() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}

		const task = this.binding;
		const unsubscribe = task.addChangeListener(() => {
			this.set({
				task,
			});
		});

		this.unsubscribe = () => {
			unsubscribe();
			delete this.unsubscribe;
		};

		this.set({
			task,
		});
	}

	cleanup() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}
}
