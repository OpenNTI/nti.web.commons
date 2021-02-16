import React from 'react';
import PropTypes from 'prop-types';
import { HOC } from '@nti/lib-commons';
import { addClass as add, removeClass as remove } from '@nti/lib-dom';

class AddClassToBody extends React.Component {
	static propTypes = {
		_node: PropTypes.object,
		_className: PropTypes.string,
		_forwardRef: PropTypes.func,
		_component: PropTypes.any,
	};

	componentDidMount() {
		const { _node, _className } = this.props;

		add(_node, _className);
	}

	componentWillUnmount() {
		const { _node, _className } = this.props;

		remove(_node, _className);
	}

	render() {
		const {
			_component: Component,
			_forwardRef: ref,
			...otherProps
		} = this.props;

		delete otherProps._node;
		delete otherProps._className;

		return <Component {...otherProps} ref={ref} />;
	}
}

export default function addClass(node, className) {
	if (!node) {
		throw new Error(
			'addClass decorator must be provided a node to add the class to.'
		);
	}
	if (!className) {
		throw new Error('addClass decorator must be provided a class to add.');
	}

	return function factory(Component) {
		const AddClassWrapper = (props, ref) => {
			return (
				<AddClassToBody
					{...props}
					_node={node}
					_className={className}
					_component={Component}
					_forwardRef={ref}
				/>
			);
		};
		const cmp = React.forwardRef(AddClassWrapper);

		HOC.hoistStatics(cmp, Component, 'addClass');

		return cmp;
	};
}
