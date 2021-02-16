import { Stores } from '@nti/lib-store';
import Logger from '@nti/util-logger';

const logger = Logger.get('common:navigation:Store');

export default class NavigationStore extends Stores.SimpleStore {
	static Singleton = true;

	constructor() {
		super();

		this.set({
			tabs: null,
			expandTabs: false,
		});
	}

	setExpandTabs(expand) {
		this.set('expandTabs', expand);
	}

	setTabs(config) {
		const tabs = this.get('tabs');

		if (tabs === config) {
			return;
		}

		this.set('tabs', config);
	}

	clearTabs(config) {
		const tabs = this.get('tabs');

		if (config !== tabs) {
			logger.error(
				"Trying to clear tabs that aren't active, doing nothing."
			);
			return;
		}

		this.set('tabs', null);
	}
}
