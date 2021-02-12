import React from 'react';
import PropTypes from 'prop-types';

import { useId } from '../use-id';

export default {
	title: 'Hooks/useId',
	component: useId,
};

const Bordered = styled.div`
	border: 1px solid black;
	padding: 1rem;
	margin: 1rem;
`;

Child.propTypes = {
	count: PropTypes.number,
	namespace: PropTypes.string,
};
function Child({ count, namespace }) {
	const id = useId(namespace);

	return (
		<Bordered>
			<p>{count}</p>
			<p>{id}</p>
		</Bordered>
	);
}

function Test(props) {
	const [count, setCount] = React.useState(0);

	return (
		<>
			<button onClick={() => setCount(count + 1)}>Increment</button>
			<Child count={count} {...props} />
		</>
	);
}

export const Base = props => <Test {...props} />;
export const Namespace = ({ namespace = 'nti' }) => {
	const [clear, setClear] = React.useState(false);
	const [ns, setNS] = React.useState();

	React.useEffect(() => (setNS(namespace), setClear(true)), [namespace]);
	React.useEffect(() => {
		if (clear) {
			setTimeout(() => {
				setClear(false);
			});
		}
	}, [clear]);

	if (clear) {
		return <div>Changing Namespace</div>;
	}

	return <Test namespace={ns} />;
};

Namespace.propTypes = {
	namespace: PropTypes.string,
};

Namespace.argTypes = {
	namespace: {
		control: { type: 'text' },
	},
};
