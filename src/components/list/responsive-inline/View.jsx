import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Triggered} from '../../../flyout';

import Menu from './Menu';

const InitialState = () => ({settled: false, boundrary: Infinity});
const defaultTrigger = React.forwardRef(({className, ...props}, ref) => {
	return (
		<div className={cx('show-remaining-items', className)} ref={ref} {...props} />
	);
});

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
			boundrary: countChildren(props.children)
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

	onWindowReszie = () => {
		if (this.handleWindowResize) { return; }

		this.handleWindowResize = setTimeout(() => {
			const node = this.list.current;

			if (node && node.offsetWidth !== this.settledWidth) {
				this.setState(InitialState);
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
				boundrary: newBoundrary
			});
		}
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

		return (
			<li className="show-remaining-items-list-item">
				<Triggered
					className="nti-responsive-inline-list-flyout"
					trigger={renderTrigger ? renderTrigger(items) : defaultTrigger}
					verticalAlign={Triggered.ALIGNMENTS.BOTTOM}
					{...flyoutProps}
				>
					<Menu items={items} />
				</Triggered>
			</li>
		);
	}
}
