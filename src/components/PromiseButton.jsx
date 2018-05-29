import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {wait} from '@nti/lib-commons';

import {Ellipse as TinyLoader} from './loading-indicators';

const NORMAL = 'normal';
const PROCESSING = 'processing';
const FINISHED = 'finished';
const FINISHED_ERROR = 'finished-error';

const RESET_DELAY = 1000; //milliseconds
const MIN_DELAY_BEFORE_FINISHING = 1000; // milliseconds

function ensureDelayOf (delay, start) {
	return (o) => {
		let timeFromStart = (Date.now() - start);
		let remaining = delay - timeFromStart;

		if (remaining > 0) {
			return wait(remaining).then(()=>o);
		}
		return o;
	};
}

export default class PromiseButton extends React.Component {

	static propTypes = {
		children: PropTypes.any, //simple nodes only please
		className: PropTypes.string,

		// The callback can return a promise if the work to be done will be async...
		onClick: PropTypes.func
	}


	static defaultProps = {
		onClick: () => wait(2000)
	}


	state = {
		status: NORMAL
	}


	reset () {
		this.setState({
			status: NORMAL
		});
	}


	componentWillUnmount () {
		//clearTimeout is safe to call on any value.
		clearTimeout(this.resetTimer);
	}


	go = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		let work = new Promise(done => {

			// Ensure the react component has redrawn. (using setState's callback)
			this.setState({ status: PROCESSING }, () => {

				let start = Date.now();

				// If the return value of onClick is not a promise, this will convert it,
				// otherwize it will resolve with it transparently.
				Promise.resolve(this.props.onClick.call(null, work))
					// This helper function returns a function that when invoked ensures the
					// time passed has been at least the amount specified from the start (second arg)
					// It will pass the promise's resolution on. (we aren't using that, but it
					// was written so it could be moved to a utility.)
					.then(ensureDelayOf(MIN_DELAY_BEFORE_FINISHING, start))

					.then(()=> FINISHED, ()=>FINISHED_ERROR) //handle promise rejection...

					// Once the onClick task has been completed, set the state to finished
					// and schedule the reset. If the component is unmounted before the reset,
					// the componentWillUnmount can cancel the timer.
					.then(status => {
						this.setState({ status });
						this.resetTimer = setTimeout(()=> { this.reset(); done(); }, RESET_DELAY);
					});
			});

		});
	}

	render () {
		const {state: { status }, props: { children: label, className }} = this;
		const css = cx('promise-button', className, status);

		return (
			<button className={css} onClick={this.go}>
				<span className="sizer">
					<span>{label}</span>
				</span>
				<ul>
					<li><span>{label}</span></li>
					<li className="processing"><TinyLoader /></li>
					<li className="finished" />
				</ul>
			</button>
		);
	}
}
