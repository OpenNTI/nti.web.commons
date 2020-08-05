import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {useMutationObserver} from '../hooks';

import Styles from './Highlighter.css';
import * as Strategies from './strategies';
import Ranges from './components/Ranges';

const cx = classnames.bind(Styles);

const MutationObserverInit = {
	subtree: true,
	childList: true
};

ContentHighlighter.Strategies = Strategies;
ContentHighlighter.propTypes = {
	children: PropTypes.any,

	as: PropTypes.any,
	className: PropTypes.string,

	strategy: PropTypes.func.isRequired
};
export default function ContentHighlighter ({children, as:tag, className, strategy, ...otherProps}) {
	const [ranges, setRanges] = React.useState([]);

	const Cmp = tag ?? 'div';
	const cmpRef = React.useRef();

	useMutationObserver(
		strategy.isActive() ? cmpRef : null,
		() => setRanges(strategy(cmpRef.current)),//todo figure out if we can/need to optimize this based off of what entities changes
		MutationObserverInit
	);

	React.useEffect(() => {
		if (cmpRef.current && strategy.isActive()) {
			setRanges(strategy(cmpRef.current));
		} else {
			setRanges([]);
		}
	}, [strategy]);

	return (
		<Cmp className={cx('content-highlighter', className)} ref={cmpRef} >
			{children}
			<Ranges ranges={ranges} containerRef={cmpRef} />
		</Cmp>
	);
}