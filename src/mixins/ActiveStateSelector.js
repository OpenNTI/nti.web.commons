import PropTypes from 'prop-types';

import NavigatableMixin from './NavigatableMixin';
import BasePath from './BasePath';

const register = 'active-state-group-register';
const unregister = 'active-state-group-unregister';
const isActive = 'active-state-group-isActive';

const PRIVATE = new WeakMap();
const initPrivate = (x, o = {}) => PRIVATE.set(x, o);
const freePrivate = x => PRIVATE.delete(x);
const getPrivate = x => PRIVATE.get(x) || {};

export default {

	componentWillMount () {
		initPrivate(this, {items: []});
	},

	componentWillUnmount () {
		freePrivate(this);
	},

	childContextTypes: {
		[isActive]: PropTypes.func,
		[register]: PropTypes.func,
		[unregister]: PropTypes.func
	},

	getChildContext () {
		return {
			[isActive]: this.isChildActive,
			[register]: this.registerActiveStateGroupChild,
			[unregister]: this.unregisterActiveStateGroupChild
		};
	},


	registerActiveStateGroupChild (cmp) {
		const {items} = getPrivate(this);
		if (items) {
			if (!items.includes(cmp)) {
				items.push(cmp);
			}

			this.setState({});
		}
	},


	unregisterActiveStateGroupChild (cmp) {
		const {items} = getPrivate(this);

		if (items) {

			const idx = items.indexOf(cmp);
			if (items && idx >= 0) {
				items.splice(idx, 1);
			}

			this.setState({});
		}
	},


	isChildActive (cmp) {
		const {items} = getPrivate(this);
		if (!items) {return false;}

		const getRef = x=> x.props.href;
		const href = getRef(cmp);


		const active = items.filter(x => x
									&& x.getActiveState()
									&& getRef(x).length >= href.length
							)
							.sort((a, b) => getRef(b).length - getRef(a).length);


		return cmp === active[0];
	}
};


export const child = {
	mixins: [BasePath, NavigatableMixin],

	contextTypes: {
		[isActive]: PropTypes.func,
		[register]: PropTypes.func,
		[unregister]: PropTypes.func
	},

	propTypes: {
		href: PropTypes.string.isRequired,

		hasChildren: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.shape({
				test: PropTypes.func.isRequired
			})
		])
	},


	componentWillMount () {
		const reg = this.context[register];
		if (reg) {
			reg(this);
		}
	},

	componentWillUnmount () {
		const unreg = this.context[unregister];
		if (unreg) {
			unreg(this);
		}
	},


	isActive () {
		const {[isActive]: active} = this.context;

		return active ? active(this) : this.getActiveState();
	},


	getActiveState () {
		const {href, hasChildren} = this.props;
		const absolute = href && href.indexOf(this.getBasePath()) === 0;
		const current = absolute ? this.makeHref(this.getPath()) : this.getPath();

		if (hasChildren && current) {
			if (hasChildren.test) {
				return hasChildren.test(current);
			}
			return current.indexOf(href) === 0;
		}

		return current === href;
	}

};
