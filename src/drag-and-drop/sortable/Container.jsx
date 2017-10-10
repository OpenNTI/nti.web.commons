import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import isTouch from 'nti-util-detection-touch';

import DragLayer from './SortDragLayer';

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

	// Must return a DnD.Item;
	// Must include a key unique to the item.
	// Must pass props to the DnD.Item
	renderItem = (item, props) => {
		return <DnD.Item key={item} {...props}>{item}</DnD.Item>
	}

	render () {
		const {items} = this.state;
		return (
			<Container onMove={this.onMove} onDragEnd={this.onDragEnd} items={items} renderer={this.renderItem} />
		);
	}
}
*/

export default
@DragDropContext(DNDBackend)
class Container extends React.Component {

	static propTypes = {
		items: PropTypes.array.isRequired,
		renderer: PropTypes.func.isRequired,
		children: PropTypes.any,
		onMove: PropTypes.func.isRequired,
		onDragEnd: PropTypes.func.isRequired,
		readOnly: PropTypes.bool,
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


	getDragPreview = (item) => {
		const {renderer} = this.props;
		return renderer(item.item);
	}

	render () {

		const {
			items = [],
			renderer,
			onMove,
			onDragEnd,
			className,
		} = this.props;

		return (
			<ol className={cx('sortable-container', className)} ref={this.attachRef}>
				{
					items.map((item, index) =>
						renderer(item, {
							index,
							item,
							onDragEnd,
							moveItem: onMove
						})
					)
				}
				{!polyfillDrag ? void 0 : ( <DragLayer key="__preview" getDragPreview={this.getDragPreview} /> )}
			</ol>
		);
	}
}
