import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import jump from 'jump.js';

import { getViewportHeight } from '@nti/lib-dom';

import { DialogButtons, LockScroll } from '../components';
import { HeightMonitor } from '../sync-height';

import {
	getDialogPositionForRect,
	getScrollOffsetForRect,
	positionsEqual,
} from './utils';

const BODY_OPEN_CLS = 'inline-dialog-open';

function getBody() {
	return typeof document === 'undefined' ? null : document.body;
}

function addOpenClsToBody() {
	const body = getBody();

	if (body) {
		body.classList.add(BODY_OPEN_CLS);
	}
}

function removeOpenClsFromBody() {
	const body = getBody();

	if (body) {
		body.classList.remove(BODY_OPEN_CLS);
	}
}

export default class InlinePrompt extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.node,
		dialogButtons: PropTypes.array,
		active: PropTypes.bool,
		topPadding: PropTypes.number,
		bottomPadding: PropTypes.number,
	};

	setDialogRef = x => (this.dialog = x);
	setInnerRef = x => (this.innerRef = x);
	setPlaceholderRef = x => (this.placeholderRef = x);

	state = {};

	componentDidMount() {
		const { active } = this.props;

		if (active) {
			this.activateModal();
		}
	}

	componentDidUpdate(prevProps) {
		const { active } = this.props;
		const { active: isActive } = prevProps;

		if (active && !isActive) {
			this.activateModal();
		} else if (!active && isActive) {
			this.deactivateModal();
		}
	}

	activateModal() {
		this.updateModal(true);

		addOpenClsToBody();
	}

	deactivateModal() {
		this.setState({
			active: false,
			dialogPosition: null,
		});

		removeOpenClsFromBody();
	}

	getDialogRect() {
		let rect = null;

		if (this.innerRef && this.placeholderRef) {
			const placeholderRect = this.placeholderRef.getBoundingClientRect();

			rect = {
				top: placeholderRect.top,
				height: this.innerRef.height,
			};
		} else {
			rect = this.dialog && this.dialog.getBoundingClientRect();
		}

		return rect;
	}

	updateModal = force => {
		const { topPadding, bottomPadding } = this.props;
		const { active } = this.state;

		if (this.isUpdating || (!active && !force)) {
			return;
		}

		this.isUpdating = true;

		const onceScrolled = new Promise(fulfill => {
			const scrollOffset = getScrollOffsetForRect(
				this.getDialogRect(),
				getViewportHeight(),
				topPadding,
				bottomPadding
			);

			if (scrollOffset) {
				jump(scrollOffset, {
					duration: 250,
					callback: fulfill,
				});
			} else {
				fulfill();
			}
		});

		onceScrolled.then(() => {
			const { dialogPosition: currentPosition } = this.state;
			const newPosition = getDialogPositionForRect(this.getDialogRect());

			if (
				!currentPosition ||
				!positionsEqual(currentPosition, newPosition)
			) {
				this.setState(
					{
						active: true,
						dialogPosition: newPosition,
					},
					() => {
						delete this.isUpdating;
					}
				);
			}
		});
	};

	getStyles() {
		const { bottomPadding } = this.props;
		const { dialogPosition } = this.state;

		let wrapper = {};
		let inner = {};
		let placeholder = {};

		if (dialogPosition) {
			inner.paddingTop = `${dialogPosition.top}px`;
			placeholder.top = `${dialogPosition.height}px`;
		}

		if (bottomPadding) {
			wrapper.paddingBottom = `${bottomPadding}px`;
		}

		return { wrapper, inner, placeholder };
	}

	render() {
		const { children, className, dialogButtons } = this.props;
		const { active } = this.state;
		const styles = this.getStyles();

		return (
			<div
				ref={this.setDialogRef}
				className={cx('inline-dialog', className, { active })}
			>
				{active ? (
					<div className="wrapper" style={styles.wrapper}>
						<LockScroll />
						<div className="inner-wrapper" styles={styles.inner}>
							<HeightMonitor ref={this.attachHeightMonitorRef}>
								{children}
							</HeightMonitor>
							<DialogButtons buttons={dialogButtons} />
						</div>
					</div>
				) : (
					children
				)}
				{active && (
					<div
						ref={this.attachPlaceholderRef}
						className="inline-dialog-placeholder"
						style={styles.placeholder}
					/>
				)}
			</div>
		);
	}
}
