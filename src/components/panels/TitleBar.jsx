import PropTypes from 'prop-types';
import cx from 'classnames';

const Icon = styled('i')`
	flex: 0 0 auto;
	font-size: 1.5rem;
	line-height: 2rem;
	color: var(--tertiary-grey);
	cursor: pointer;
	opacity: 0.8;

	&:hover {
		opacity: 1;
	}
`;

const Title = styled.h1`
	margin: 0;
	font: normal 300 1.5rem/2rem var(--body-font-family);
	flex: 1 1 auto;
	color: var(--primary-grey);
`;

TitleBarImpl.propTypes = {
	title: PropTypes.node.isRequired,
	className: PropTypes.string,
	iconAction: PropTypes.func,
	iconCls: PropTypes.string,
	iconLabel: PropTypes.string,
};

function TitleBarImpl({
	title,
	className,
	iconAction,
	iconCls = 'icon-light-x',
	iconLabel = 'Close',
}) {
	return (
		<div
			className={cx('panel-title-bar', className)}
			panel-title-bar="true"
		>
			{typeof title === 'string' ? <Title>{title}</Title> : title}
			{iconAction && (
				<Icon
					className={iconCls}
					role="button"
					data-tip={iconLabel}
					aria-label={iconLabel}
					onClick={iconAction}
				/>
			)}
		</div>
	);
}

export const TitleBar = styled(TitleBarImpl)`
	background: white;
	padding: 0.5625rem 1.25rem;
	display: flex;
`;
