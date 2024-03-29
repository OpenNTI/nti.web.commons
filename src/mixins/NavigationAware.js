import PropTypes from 'prop-types';

const ENVIRONMENT_TYPE = PropTypes.shape({
	getPath: PropTypes.func.isRequired,
	setPath: PropTypes.func.isRequired,
});

export default {
	contextTypes: {
		defaultEnvironment: ENVIRONMENT_TYPE.isRequired,
		routerLinkComponent: PropTypes.func.isRequired,
		router: PropTypes.shape({
			getEnvironment: PropTypes.func,
			getNavigable: PropTypes.func,
			getMatch: PropTypes.func,
			getParentRouter: PropTypes.func,
			getPath: PropTypes.func,
			makeHref: PropTypes.func,
			navigate: PropTypes.func,
		}),
	},

	propTypes: {
		environment: ENVIRONMENT_TYPE,
	},

	getLinkComponent() {
		return this.context.routerLinkComponent;
	},

	getNavigable() {
		const {
			context: { router, defaultEnvironment },
			props: { environment },
		} = this;

		return environment || router || defaultEnvironment;
	},

	getPath() {
		return this.getNavigable().getPath();
	},
};
