import React from 'react';
import PropTypes from 'prop-types';

export default class LoadingPlaceholder extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		loading: PropTypes.bool,
		fallback: PropTypes.node,
		delay: PropTypes.number
	}

	state = {delaying: true}

	componentDidMount () {
		this.setup();
	}


	componentDidUpdate (prevProps) {
		const {loading} = this.props;
		const {loading:wasLoading} = prevProps;

		if (loading !== wasLoading) {
			this.setup();
		}
	}


	setup () {
		const {loading, delay} = this.props;

		if (!loading) {
			clearTimeout(this.delayingTimeout);
			return;
		}

		this.setState({delaying: true});

		this.delayingTimeout = setTimeout(() => {
			this.setState({delaying: false});
		}, delay || 500);
	}

	render () {
		const {loading, children, fallback} = this.props;
		const {delaying} = this.state;

		const showChildren = !loading;
		const showFallback = loading && !delaying;

		if (showChildren) { return children; }
		if (showFallback) { return fallback; }

		return null;
	}
}