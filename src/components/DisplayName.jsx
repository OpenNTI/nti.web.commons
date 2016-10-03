import React from 'react';
import ReactDOMServer from 'react-dom/server';

import cx from 'classnames';

import t from 'nti-lib-locale';
import {getAppUsername, User} from 'nti-web-client';


/**
 * This DisplayName component can use the full Entity instance if you have it.
 * Otherwise, it will take a username string for the entity prop. If you do not
 * have the full entity object, and you want to show the display name, do not
 * resolve the full entity object yourself just to pass to this componenent.
 * Only resolve the entity IF and ONLY IF you need it for something else. Most
 * likely, if its a link, or something, use the corresponding Component,
 * do not roll your own.
 */
export default class DisplayName extends React.Component {

	static propTypes = {
		className: React.PropTypes.string,

		localeKey: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.func
		]),

		tag: React.PropTypes.any,

		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		]).isRequired,

		/**
		 * Specifies to substitute your name with "You".
		 *
		 * @type {boolean}
		 */
		usePronoun: React.PropTypes.bool,

		/**
		 * Sharing Scopes (entity objects) are given GeneralNames by the suggestion provider.
		 * This flag will instruct this component to use that designation instead of the displayName.
		 *
		 * @type {boolean}
		 */
		useGeneralName: React.PropTypes.bool
	}


	constructor (props) {
		super(props);
		this.state = {
			displayName: ''
		};
	}


	componentDidMount () { this.fillIn(); }

	componentWillReceiveProps (nextProps) {
		let {entity} = this.props;
		if (entity !== nextProps.entity) {
			this.fillIn(nextProps);
		}
	}


	fillIn (props = this.props) {
		let appuser = getAppUsername();
		let {usePronoun} = props;
		let task = Date.now();

		let set = state => {
			if (this.state.task === task) {
				this.setState(state);
			}
		};

		this.setState({task}, ()=> User.resolve(props)
			.then(
				entity => {
					let displayName = (usePronoun && entity.getID() === appuser)
						? 'You'
						: entity.displayName;

					let { generalName } = entity;

					set({ displayName, generalName });
				},
				()=> set({ failed: true, displayName: 'Unknown' })
			));

	}


	render () {
		const {
			props: {className, entity, localeKey, tag, useGeneralName,...otherProps},
			state: {displayName, generalName}
		} = this;

		const Tag = tag || (localeKey ? 'address' : 'span');
		let name = (useGeneralName && generalName) || displayName;

		const props = {
			...otherProps,
			className: cx('username', className),
			children: name,
			'data-for': User.getDebugUsernameString(entity)
		};

		delete props.usePronoun;

		if (localeKey) {
			name = ReactDOMServer.renderToStaticMarkup(<a rel="author" className="username">{name}</a>);

			const getString = (typeof localeKey === 'function') ? localeKey : (o => t(localeKey, o));

			Object.assign(props, {
				children: void 0,
				dangerouslySetInnerHTML: {'__html': getString({name})}
			});
		}

		return <Tag {...props} rel="author"/>;
	}
}
