import PropTypes from 'prop-types';
import cx from 'classnames';

import Header from './Header';
import Footer from './Footer';

const Layout = styled.div`
	--side-padding: 1.5rem;

	background: white;
	position: relative;
`;
const Body = styled.div`
	max-width: 100vw;
	max-height: calc(var(--vh, 1vh) * 98 - var(--window-header-height, 90px));
	overflow: auto;
	position: relative;
`;

BaseWindowLayout.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,
};
export default function BaseWindowLayout({
	className,
	children,
	...otherProps
}) {
	// const [headerHeight, setHeaderHeight] = useState();
	return (
		<Layout className={cx('base-window-layout', className)}>
			<Header
				{...otherProps}
				/* ref={useElementHeight(setHeaderHeight)} */
				/* TODO: write useElementHeight hook */
			/>
			<Body
				className="window-body"
				/* style={{'--window-header-height: headerHeight}} */
			>
				{children}
			</Body>
			<Footer {...otherProps} />
		</Layout>
	);
}
