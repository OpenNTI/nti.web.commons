import { Stores } from '@nti/lib-store';

export default class AsideStore extends Stores.SimpleStore {
	showAside(cmp, { side }) {
		this.setImmediate({
			aside: { cmp, side },
		});
	}

	hideAside(cmp) {
		const aside = this.get('aside');

		if (aside && aside.cmp === cmp) {
			this.setImmediate({
				aside: null,
			});
		}
	}

	setAsidePlaceholder(node) {
		this.set({
			placeholder: node,
		});
	}
}
