import React, { Children } from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import {getRefHandler, HOC} from '@nti/lib-commons';

const logger = Logger.get('common:high-order-components:ItemChanges');

const CHANGE_HANDLERS = new WeakMap();

function itemChanged (scope, ...args) {
	const {refChild, props: {onItemChanged}} = scope;
	if (!scope.mounted) {
		stopListening(scope);
		return;
	}

	if (onItemChanged) {
		onItemChanged(...args);
	}
	else if (refChild && refChild.onItemChanged) {
		refChild.onItemChanged(...args);
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


function listen (scope, item) {
	if (item) {
		if (typeof item.addListener !== 'function') {
			logger.warn('Item is not observable: %o', item);
			return;
		}
		item.addListener('change', getHandler(scope));
	}
}


function stopListening (scope, item) {
	item = item || getItem(scope, scope.props, scope.state, scope.context);

	if (item && typeof item.removeListener === 'function') {
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

		// const cmp = React.forwardRef((props, ref) => (
		// 	<ItemChanges item={getItem(Component, props, {}, {})}>
		// 		<Component {...props} ref={ref}/>
		// 	</ItemChanges>
		// ));

		const cmp = class ItemChangesWrapper extends React.Component {
			render () {
				const contextProxy = process.env.NODE_ENV === 'production'
					? {}
					: new Proxy(this.context, {
						get (target, prop) {
							logger.warn('Accessing ' + prop + ' in ItemChanges context');

							return Reflect.get(...arguments);
						}
					});

				return (
					<ItemChanges item={getItem(Component, this.props, {}, contextProxy)}>
						<Component {...this.props}/>
					</ItemChanges>
				);
			}
		};

		cmp.WrappedComponent = Component.WrappedComponent || Component;

		return HOC.hoistStatics(cmp, Component, 'ItemChanges');
	}


	constructor (props) {
		super(props);
		listen(this, getItem(this, this.props, this.state, this.context));
	}


	attachRef = x => this.refChild = x

	componentDidMount () {
		this.mounted = true;
	}


	componentDidUpdate (...prev) {
		const next = [this.props, this.state, this.context];
		stopListening(this, getItem(this, ...prev));
		listen(this, getItem(this, ...next));
	}


	componentWillUnmount () {
		delete this.mounted;
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
