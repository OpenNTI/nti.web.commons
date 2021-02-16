export function getItem(o, p, ...r) {
	if (o.getItem) {
		return o.getItem(p, ...r);
	}
	return p.item;
}

export default {
	componentDidMount() {
		this.listen(getItem(this, this.props, this.state, this.context));
	},

	componentDidUpdate(...prev) {
		let next = [this.props, this.state, this.context];
		this.stopListening(getItem(this, ...prev));
		this.listen(getItem(this, ...next));
	},

	componentWillUnmount() {
		this.stopListening(getItem(this, this.props));
	},

	listen(item) {
		if (item) {
			if (typeof item.addListener !== 'function') {
				return;
			}
			item.addListener('change', this.itemChanged);
		}
	},

	stopListening(item) {
		if (item && typeof item.removeListener === 'function') {
			item.removeListener('change', this.itemChanged);
		}
	},

	itemChanged() {
		if (this.onItemChanged) {
			this.onItemChanged();
		} else {
			this.forceUpdate();
		}
	},
};
