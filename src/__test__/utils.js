/*eslint-env jest*/
import renderer from 'react-test-renderer';

export const render = (exp, ...options) => renderer.create(exp, ...options);
export const verify = (exp, ...options) => {
	const r = render(exp, ...options);
	expect(r.toJSON()).toMatchSnapshot();
	return r;
};
