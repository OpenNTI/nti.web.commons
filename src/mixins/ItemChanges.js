import React from 'react';

function getItem (o, p, ...r) {
	if (o.getItem) {
		return o.getItem(p, ...r);
	}
	return p.item;
}

const MIXIN = {

	componentDidMount () {
		this.listen(getItem(this, this.props, this.state, this.context));
	},


	componentWillReceiveProps (...next) {
		let prev = [this.props, this.state, this.context];
		this.stopListening(getItem(this, ...prev));
		this.listen(getItem(this, ...next));
	},


	componentDidUpdate (...prev) {
		let next = [this.props, this.state, this.context];
		this.stopListening(getItem(this, ...prev));
		this.listen(getItem(this, ...next));
	},


	componentWillUnmount () {
		this.stopListening(getItem(this, this.props));
	},


	listen (item) {
		if (item) {
			item.addListener('change', this.itemChanged);
		}
	},


	stopListening (item) {
		if (item) {
			item.removeListener('change', this.itemChanged);
		}
	},


	itemChanged () {
		if (this.onItemChanged) {
			this.onItemChanged();
		} else {
			this.forceUpdate();
		}
	}
};


export default MIXIN;
export function compose(Component) {
	const getter = !Component.getItem ? {} : {
		getItem: (...a) => Component.getItem(...a)
	}

	return React.createClass({
		propTypes: {
			item: React.PropTypes.object.isRequired
		},

		render() {
			return <Component {...this.props} />;
		},

		...getter,
		...MIXIN
	});
};
