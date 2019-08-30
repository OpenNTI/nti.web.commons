import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getScrollParent, getScrollPosition, getViewportHeight} from '@nti/lib-dom';
import {Events} from '@nti/lib-commons';

function isScrollLocked (scroller) {
	if (scroller.classList) { return scroller.classList.contains('scroll-lock'); }
	if (typeof document === 'undefined') { return false; } 

	return Boolean(document.querySelector('html.scroll-lock'));
}

function getScrollInfo (scroller) {
	const position = getScrollPosition(scroller);

	return {
		scrollTop: position.top,
		scrollHeight: position.height,
		height: scroller.clientHeight || getViewportHeight(),
		locked: isScrollLocked(scroller)
	};
}

export default class InfiniteContinousScroll extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		as: PropTypes.string,
		children: PropTypes.any,
		loadMore: PropTypes.func,
		buffer: PropTypes.number
	}

	node = React.createRef()

	componentDidMount () {
		const element = this.node.current;
		const onScroll = () => this.check();
		
		const eventArgs = ['scroll', onScroll];

		if (Events.supportsPassive()) {
			eventArgs.push({passive: true});
		}

		this.scroller = getScrollParent(element);

		this.scroller.addEventListener(...eventArgs);
		this.stopListening = () => {
			this.scroller.removeEventListener(...eventArgs);
			delete this.stopListening;
		};

		this.check();
	}


	componentWillUnmount () {
		if (this.stopListening) {
			this.stopListening();
		}
	}

	componentDidUpdate (prevProps) {
		const {children} = this.props;
		const {children:oldChildren} = prevProps;

		if (children !== oldChildren) {
			delete this.loadingMore;
			this.check();
		}
	} 


	check = () => {
		const {buffer, loadMore} = this.props;
		
		if (!this.scroller || !loadMore || this.loadingMore) { return; }

		const {scrollTop, scrollHeight, height, locked} = getScrollInfo(this.scroller);

		if (locked) { return; }

		const trigger = Math.max(scrollHeight - height - buffer, 0);

		if (scrollHeight === height || scrollTop > trigger) {
			this.loadingMore = true;
			setImmediate(() => loadMore());
		}
	}


	render () {
		const {className, as: tag, loadMore, buffer, children, ...otherProps} = this.props;
		const Cmp = tag || 'div';

		return (
			<Cmp
				ref={this.node}
				className={cx(className, 'nti-continous-scroll', {'has-more': !!loadMore})}
				data-scroll-buffer={buffer}
				{...otherProps}
			>
				{children}
			</Cmp>
		);
	}
}