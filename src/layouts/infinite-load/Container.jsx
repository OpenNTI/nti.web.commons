import React from 'react';
import PropTypes from 'prop-types';

export default class InfiniteLoadContainer extends React.Component {
	static childContextTypes = {
		infiniteLoadContainer: PropTypes.shape({
			addEventListener: PropTypes.func,
			removeEventListener: PropTypes.func,
			clientHeight: PropTypes.number,
			scrollTop: PropTypes.number,
		}),
	};

	attachContainer = x => (this.container = x);

	getChildContext() {
		const container = {
			addEventListener: (...args) =>
				this.container && this.container.addEventListener(...args),
			removeEventListener: (...args) =>
				this.container && this.container.removeEventListener(...args),
		};

		Object.defineProperties(container, {
			offsetTop: {
				get: () => (this.container ? this.container.offsetTop : 0),
			},
			clientHeight: {
				get: () => (this.container ? this.container.clientHeight : 0),
			},
			scrollTop: {
				get: () => (this.container ? this.container.scrollTop : 0),
				set: scrollTop => {
					if (this.container) {
						this.container.scrollTop = scrollTop;
					}
				},
			},
		});

		return {
			infiniteLoadContainer: container,
		};
	}

	render() {
		return <div {...this.props} ref={this.attachContainer} />;
	}
}
