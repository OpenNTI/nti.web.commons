/* eslint-env jest */
import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import SingleInstance from '../SingleInstance';

describe('Single Instance Decorator', () => {
	let mountPoint;

	beforeEach(() => {
		mountPoint = document.createElement('div');
		document.body.appendChild(mountPoint);
	});

	afterEach(() => {
		ReactDOM.unmountComponentAtNode(mountPoint);
		document.body.removeChild(mountPoint);
	});

	const Single = SingleInstance(
		class Single extends React.PureComponent {
			render = () => <div className="test-component">Test</div>;
		}
	);

	test('Renders only one instance', () => {
		ReactDOM.render(
			<div>
				<Single />
				<Single />
				<Single />
			</div>,
			mountPoint
		);

		expect(document.querySelectorAll('.test-component')).toHaveLength(1);
	});

	test('Renders at least one instance', () => {
		ReactDOM.render(<Single />, mountPoint);
		expect(document.querySelectorAll('.test-component')).toHaveLength(1);
	});

	test('One instance remains in DOM until all unmount', () => {
		class Test extends React.PureComponent {
			render() {
				const { length } = this.props;
				return (
					<div>
						{Array.from({ length }, (_, i) => (
							<Single key={i} />
						))}
					</div>
				);
			}
		}

		let length = 3;
		const instance = renderer.create(<Test length={length} />);
		const components = () =>
			instance.root.findAllByProps({ className: 'test-component' });

		expect(instance.root.findAllByType(Single)).toHaveLength(length);
		expect(components()).toHaveLength(1);

		for (; length > 0; length--) {
			instance.update(<Test length={length} />);
			expect(components()).toHaveLength(1);
		}

		instance.update(<Test length={length} />);
		expect(components()).toHaveLength(0);
	});
});
