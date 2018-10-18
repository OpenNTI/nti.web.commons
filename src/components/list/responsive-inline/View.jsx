import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Triggered} from '../../../flyout';

import Menu from './Menu';

const InitialState = () => ({settled: false, boundrary: Infinity, triggerClasses: []});

const defaultTrigger = (classes) => {
	return React.forwardRef(({className, ...props}, ref) => {
		return (
			<div className={cx('show-remaining-items', className, classes)} ref={ref} {...props} />
		);
	});
};

const countChildren = (children) => {
	return React.Children.toArray(children).length;
};

export default class ResponsiveInlineList extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		onSettled: PropTypes.func,
		getPropsForListItem: PropTypes.func,
		renderTrigger: PropTypes.func,
		flyoutProps: PropTypes.object
	}


	list = React.createRef()
	state = InitialState()


	constructor (props) {
		super(props);

		this.state = {
			settled: false,
			boundrary: countChildren(props.children),
			triggerClasses: []
		};
	}


	componentDidMount () {
		this.maybeSettle(this.props);

		global.addEventListener('resize', this.onWindowResize);
	}

	componentWillUnmount () {
		global.removeEventListener('resize', this.onWindowResize);
	}


	componentDidUpdate (prevProps) {
		const {children:items} = this.props;
		const {children:prevItems} = prevProps;

		if (prevItems !== items) {
			this.setState({
				settled: false,
				boundrary: countChildren(items)
			});
		} else {
			this.maybeSettle(this.props);
		}
	}

	onWindowResize = () => {
		if (this.handleWindowResize) { return; }

		this.handleWindowResize = setTimeout(() => {
			const node = this.list.current;

			if (node && node.offsetWidth !== this.settledWidth) {
				this.setState({
					settled: false,
					boundrary: countChildren(this.props.children)
				});
			}

			delete this.handleWindowResize;
		}, 100);
	}


	maybeSettle (props) {
		const {children, onSettled} = props;
		const items = React.Children.toArray(children);
		const node = this.list.current;
		const {settled, boundrary} = this.state;

		if (!node || !items || settled) { return; }

		const doSettle = () => {
			this.settledWidth = node.offsetWidth;

			this.setState({
				settled: true
			}, () => {
				if (onSettled) {
					onSettled(this.settledWidth);
				}
			});
		};

		const overflow = node.scrollWidth - node.clientWidth; //how much width if overflowing

		//if there no overflow there's nothing to do
		if (overflow <= 0) {
			doSettle();
			return;
		}

		let newBoundrary = boundrary - 1;
		let removedWidth = 0;

		while (removedWidth < overflow && boundrary >= 0) {
			const li = node.querySelector(`li[data-index="${newBoundrary}"]`);

			removedWidth += li.clientWidth;
			newBoundrary -= 1;
		}

		//if we've popped all items off go ahead and settle
		if (newBoundrary < 0) {
			this.setState({
				settled: false,
				boundrary: -1
			}, () => {
				doSettle();
			});
		} else {
			this.setState({
				settled: false,
				boundrary: newBoundrary + 1
			});
		}
	}


	getTriggerClasses () {
		return this.pendingTriggerClasses || this.state.triggerClasses;
	}


	setTriggerClasses (classes) {
		this.pendingTriggerClasses = classes;

		if (this.setTriggerClassesTimeout) { return; }

		this.setTriggerClassesTimeout = setTimeout(() => {
			this.setState({
				triggerClasses: this.pendingTriggerClasses
			});

			delete this.pendingTriggerClasses;
			delete this.setTriggerClassesTimeout;
		}, 100);
	}


	addTriggerClass = (classname) => {
		const classes = this.getTriggerClasses();

		this.setTriggerClasses([...classes, classname]);
	}


	removeTriggerClass = (classname) => {
		const classes = this.getTriggerClasses();

		let newClasses = [];
		let removed = false;

		for (let cls of classes) {
			if (cls === classname && !removed) {
				removed = true;
			} else {
				newClasses.push(cls);
			}
		}

		this.setTriggerClasses(newClasses);
	}



	render () {
		const {children, className, getPropsForListItem} = this.props;
		const {boundrary, settled} = this.state;
		const items = React.Children.toArray(children);

		const visibleItems = items.slice(0, boundrary);
		const menuItems = items.slice(boundrary);

		return (
			<ul className={cx('nti-responsive-inline-list', className, {settled})} ref={this.list}>
				{visibleItems.map((item, index) => {
					const props = getPropsForListItem ? getPropsForListItem(item, index) : {};

					return (
						<li key={index} {...props} data-index={index}>
							{item}
						</li>
					);
				})}
				{menuItems.length > 0 && this.renderMenuItems(menuItems)}
			</ul>
		);
	}


	renderMenuItems (items) {
		const {renderTrigger, flyoutProps = {}} = this.props;
		const {triggerClasses} = this.state;

		return (
			<li className="show-remaining-items-list-item">
				<Menu hidden items={items} addTriggerClass={this.addTriggerClass} removeTriggerClass={this.removeTriggerClass} />
				<Triggered
					className="nti-responsive-inline-list-flyout"
					trigger={renderTrigger ? renderTrigger(items, triggerClasses) : defaultTrigger(triggerClasses)}
					verticalAlign={Triggered.ALIGNMENTS.BOTTOM}
					horizontalAlign={Triggered.ALIGNMENTS.LEFT_OR_RIGHT}
					{...flyoutProps}
				>
					<Menu items={items} />
				</Triggered>
			</li>
		);
	}
}
