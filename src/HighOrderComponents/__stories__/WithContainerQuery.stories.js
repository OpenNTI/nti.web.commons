import React from 'react';
import PropTypes from 'prop-types';

import WithContainerQuery from '../WithContainerQuery';

export default {
	title: 'High Order Components/With Container Query',
	component: WithContainerQuery,
};

TestCmp.propTypes = {
	size: PropTypes.string,
};
function TestCmp({ size }) {
	return <div>{size}</div>;
}

const TestWrapper = WithContainerQuery([
	{ query: size => size.width > 1000, props: { size: 'Large' } },
	{ query: size => size.width > 500, props: { size: 'Medium' } },
	{ query: () => true, props: { size: 'small' } },
])(TestCmp);

export const Base = () => <TestWrapper />;
