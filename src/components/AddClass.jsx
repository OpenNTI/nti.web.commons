import React from 'react';
import PropTypes from 'prop-types';
import {addClass, removeClass} from '@nti/lib-dom';

function add (node, className) {
	add.count = (add.count || 0) + 1;
	addClass(node, className);
	return () => {
		add.count = Math.max(add.count - 1, 0); // ensure we're never negative. shouldn't happen anyway.
		if (!add.count) {
			removeClass(node, className);
		}
	};
}

export default class AddClass extends React.Component {

	static propTypes = {
		node: PropTypes.object,
		className: PropTypes.string
	}

	static defaultProps = {
		node: document.body,
	}

	componentDidMount () {
		this.setUp();
	}
	
	setUp () {
		const {node, className} = this.props;
		this.remove = add(node, className);
	}

	componentDidUpdate ({node: pNode, className: pClass}) {
		const {node, className} = this.props;

		if (node !== pNode || className !== pClass) {
			this.remove();
			this.setUp();
		}
	}

	componentWillUnmount () {
		this.remove();
	}

	render () {
		return null;
	}
}
