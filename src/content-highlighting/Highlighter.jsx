import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {useMutationObserver} from '../hooks';

import Styles from './Highlighter.css';

const cx = classnames.bind(Styles);

const MutationObserverInit = {
	subtree: true
};

ContentHighlighter.propTypes = {
	children: PropTypes.any,

	as: PropTypes.any,
	className: PropTypes.string,

	strategy: PropTypes.func
};
export default function ContentHighlighter ({children, as:tag, className, strategy, ...otherProps}) {
	const [highlights, setHighlights] = React.useState([]);

	const Cmp = tag ?? 'div';
	const cmpRef = React.useRef();

	useMutationObserver(
		strategy ? cmpRef : null,
		() => {
			debugger;
		},
		MutationObserverInit
	);

	React.useEffect(() => {


	}, [strategy]);

	return (
		<Cmp className={cx('content-highlighter')} {...otherProps} >
			{children}
			<div className={cx('content-highlights-container')} data-highlights-container="true">
				highlights
			</div>
		</Cmp>
	);
}