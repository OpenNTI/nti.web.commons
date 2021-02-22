import cx from 'classnames';

export default styled('ul').attrs(({ className, ...props }) => ({
	...props,
	className: cx('unadorned-list', className),
}))`
	list-style: none;
	padding: 0;
	margin: 0;
`;
