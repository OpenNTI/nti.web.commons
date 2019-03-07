import {Stores} from '@nti/lib-store';

export default class AsideStore extends Stores.SimpleStore {
	showAside (cmp, {sticky, fill, side}) {
		this.set({
			aside: {cmp, sticky, fill, side}
		});
	}


	hideAside (cmp) {
		const aside = this.get('aside');

		if (aside && aside.cmp === cmp) {
			this.set({
				aside: null
			});
		}
	}


	setAsidePlaceholder (node) {
		this.set({
			placeholder: node
		});
	}
}
