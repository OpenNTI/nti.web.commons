import PropTypes from 'prop-types';

export default {

	contextTypes: {
		basePath: PropTypes.string.isRequired
	},

	getBasePath () {
		return this.context.basePath;
	}

};
