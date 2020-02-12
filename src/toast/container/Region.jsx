import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

import {Locations} from '../Constants';

import Styles from './Styles.css';
import ToastWrapper from './ToastWrapper';

const cx = classnames.bind(Styles);

const getTransitionName = location => `${location.toLowerCase()}-transition`;
const getClassName = location => location.toLowerCase();

TileContainerRegion.propTypes = {
	location: PropTypes.oneOf(Object.values(Locations)),
	toasts: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string
		})
	)
};
export default function TileContainerRegion ({location, toasts}) {
	if (!toasts || toasts.length === 0) { return null; }

	return (
		<TransitionGroup component="ul" className={cx('toast-region', getClassName(location))}>
			{toasts.map((toast) => (
				<CSSTransition key={toast.id} classNames={getTransitionName(location)} timeout={200} appear>
					<ToastWrapper toast={toast} location={location} />
				</CSSTransition>
			))}
		</TransitionGroup>
	);
}