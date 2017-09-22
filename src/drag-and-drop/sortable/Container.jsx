import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import isTouch from 'nti-util-detection-touch';

import DragLayer from './SortDragLayer';
import Item from './Item';
import LockedItem from './LockedItem';

const isIE = /(Trident|Edge)\//.test((global.navigator || {}).userAgent);
const polyfillDrag = isTouch && !isIE;
const DNDBackend = polyfillDrag ? TouchBackend() : HTML5Backend;

const stop = e => e.preventDefault();

/* Example usage:
** Note that each child of <Container> must have a key attribute that's unique to the item **
class Sortable extends React.Component {

	state = {
		items: [
			'Item 1',
			'Item 2',
			...
		]
	}

	onMove = (from, to) => {
		const {items} = this.state;
		this.setState({
			items: ArrayUtils.move(items, from, to)
		});
	}

	onDragEnd = () => {
		// do something when drag ends; persist changes, etc.
	}

	render () {
		const {items} = this.state;
		return (
			<Container onMove={this.onMove} onDragEnd={this.onDragEnd}>
				{items.map((item, index) => <div key={item}>{item}</div>)}
			</Container>
		);
	}
}
*/

export default
@DragDropContext(DNDBackend)
class Container extends React.Component {

	static propTypes = {
		onMove: PropTypes.func.isRequired,
		onDragEnd: PropTypes.func.isRequired,
		readOnly: PropTypes.bool,
		children: PropTypes.any,
		className: PropTypes.string
	}

	attachRef = el => {
		const prev = this.containerNode;

		if (el !== prev) {
			if (el) {
				el.addEventListener('touchstart', stop, false);
				el.addEventListener('touchmove', stop, false);
				el.addEventListener('touchend', stop, false);
			}
			else if (prev) {
				prev.removeEventListener('touchstart', stop, false);
				prev.removeEventListener('touchmove', stop, false);
				prev.removeEventListener('touchend', stop, false);
			}

			this.containerNode = el;
		}
	}

	render () {

		const {
			onMove,
			onDragEnd,
			readOnly,
			className,
			children
		} = this.props;

		const isModifiable = !readOnly;
		let locked = 0;

		return (
			<ol className={cx('sortable-container', className)} ref={this.attachRef}>
				{React.Children.map(children, (child, index) => {

					if (child.type === LockedItem) {
						locked++;
						return child;
					}
					return (
						<Item
							key={child.key}
							index={index - locked}
							onDragEnd={onDragEnd}
							moveItem={isModifiable ? onMove : null}
						>
							{child}
						</Item>
					);
				})}
				{!polyfillDrag ? void 0 : ( <DragLayer key="__preview"/> )}
			</ol>
		);
	}
}
