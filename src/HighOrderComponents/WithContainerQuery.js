import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {HOC} from '@nti/lib-commons';

import {Monitor} from '../components';

import Variant from './Variant';

function buildPropGetter (queries) {
	if (typeof queries === 'function') {
		return (size) => queries(size);
	}

	if (!Array.isArray(queries)) {
		queries = [queries];
	}

	return (size) => {
		for (let query of queries) {
			if (query.query(size)) {
				if (typeof query.props === 'function') {
					return query.props(size);
				} else {
					return query.props;
				}
			}
		}
	};
}

ContainerQuery.propTypes = {
	_propGetter: PropTypes.func,
	_component: PropTypes.any,
	_componentRef: PropTypes.any,

	className: PropTypes.string,
	as: PropTypes.any
};
function ContainerQuery ({_propGetter, _component:Cmp, _componentRef, className, as, ...otherProps}) {
	const [activeProps, setActiveProps] = React.useState({});

	const onSizeChange = React.useCallback((size) => setActiveProps(_propGetter(size)), [_propGetter]);

	return (
		<Monitor.ElementSize
			as={as}
			onChange={onSizeChange}
			className={cx(className, activeProps?.className)}
		>
			<Cmp {...Variant.combineProps(activeProps, otherProps)} ref={_componentRef} />
		</Monitor.ElementSize>
	);
}

export default function WithContainerQuery (queries, containerProps = {}) {
	const propGetter = buildPropGetter(queries);

	return (Cmp) => {
		const Wrapper = (props, ref) => (
			<ContainerQuery
				_propGetter={propGetter}
				_component={Cmp}
				_componentRef={ref}
				{...Variant.combineProps(props, containerProps)}
			/>
		);

		const cmp = React.forwardRef(Wrapper);

		const componentName = Cmp.displayName || Cmp.name;
		const variantName = `${componentName}(WithContainerQuery)`;

		HOC.hoistStatics(cmp, Cmp, variantName);

		return cmp;
	};
}
