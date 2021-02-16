import React from 'react';
import PropTypes from 'prop-types';

export default class LoadingPlaceholder extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		loading: PropTypes.bool,
		fallback: PropTypes.node,
		delay: PropTypes.number,
		min: PropTypes.number,
	};

	static defaultProps = {
		delay: 500,
		min: 500,
	};

	state = { delaying: true, loading: true };

	componentDidMount() {
		this.setup();
	}

	componentWillUnmount() {
		clearTimeout(this.delayingTimeout);
		clearTimeout(this.minLoadTimeout);
	}

	componentDidUpdate(prevProps) {
		const { loading } = this.props;
		const { loading: wasLoading } = prevProps;

		if (loading !== wasLoading) {
			this.setup();
		}
	}

	setup() {
		const { loading, delay, min } = this.props;
		const { started } = this.state;
		const now = Date.now();

		if (!loading && !started) {
			this.setState({
				delaying: false,
				loading: false,
			});
			return;
		}

		if (!loading && started) {
			clearTimeout(this.delayingTimeout);
			const loadtime = now - started;
			this.minLoadTimeout = setTimeout(() => {
				this.setState({
					delaying: false,
					loading: false,
					started: null,
				});
			}, Math.max(0, min - loadtime));
			return;
		}

		this.setState(
			{
				delaying: delay > 0,
				started: Date.now(),
				loading: true,
			},
			() => {
				if (this.state.delaying) {
					this.delayingTimeout = setTimeout(() => {
						this.setState({ delaying: false });
					}, delay);
				}
			}
		);
	}

	render() {
		const { children, fallback } = this.props;
		const { delaying, loading } = this.state;

		const showChildren = !loading;
		const showFallback = loading && !delaying;

		if (showChildren) {
			return children;
		}
		if (showFallback) {
			return fallback;
		}

		return null;
	}
}
