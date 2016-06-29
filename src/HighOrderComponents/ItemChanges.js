import React, {Children, PropTypes} from 'react';
import Logger from 'nti-util-logger';

const logger = Logger.get('common:high-order-components:ItemChanges');

const CHANGE_HANDLERS = new WeakMap();
const REF_HANDLERS = new WeakMap();

function itemChanged (scope) {
	const {refChild, props: {onItemChanged}} = scope;

	if (onItemChanged) {
		onItemChanged();
	}
	else if (refChild && refChild.onItemChanged) {
		refChild.onItemChanged();
	} else {
		scope.forceUpdate();
	}
}

function getItem (o, p, ...r) {
	if (o.getItem) {
		return o.getItem(p, ...r);
	}
	return p.item;
}

function getHandler (scope) {
	let h = CHANGE_HANDLERS.get(scope);
	if (!h) {
		h = itemChanged.bind(scope, scope);
		CHANGE_HANDLERS.set(scope, h);
	}
	return h;
}

function getRefHandler (parentRef, localRef) {
	if (typeof parentRef !== 'function') {
		if (parentRef) {
			logger.error('ItemChanges has stollen your ref! sorry :/');
		}
		return localRef;
	}

	let h = REF_HANDLERS.get(parentRef);
	if (!h) {
		h = (x) => {parentRef(x); localRef(x);};
		REF_HANDLERS.set(parentRef, h);
	}
	return h;
}


function listen (scope, item) {
	if (item) {
		item.addListener('change', getHandler(scope));
	}
}


function stopListening (scope, item) {
	if (item) {
		item.removeListener('change', getHandler(scope));
	}
}


export default class ItemChanges extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		children: PropTypes.node,
		onItemChanged: PropTypes.func
	}

	static compose (Component) {

		return function ItemChangesComposer (props, context) {
			return (
				<ItemChanges item={getItem(Component, props, {}, context)}>
					<Component {...props}/>
				</ItemChanges>
			);
		};
	}


	constructor (props) {
		super(props);
		listen(this, getItem(this, this.props, this.state, this.context));
	}


	attachRef = x => this.refChild = x


	componentWillReceiveProps (...next) {
		const prev = [this.props, this.state, this.context];
		stopListening(this, getItem(this, ...prev));
		listen(this, getItem(this, ...next));
	}


	componentDidUpdate (...prev) {
		const next = [this.props, this.state, this.context];
		stopListening(this, getItem(this, ...prev));
		listen(this, getItem(this, ...next));
	}


	componentWillUnmount () {
		stopListening(this, getItem(this, this.props));
	}


	render () {
		const {children} = this.props;
		const child = Children.count(children) > 0 && Children.only(children);

		if (!child) { return null; }

		const ref = getRefHandler(child.ref, this.attachRef);
		return React.cloneElement(child, {ref});
	}
}
