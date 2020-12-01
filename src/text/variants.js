import cx from 'classnames';

const styles = css`
	.nti-text {
		font-family: var(--body-font-family);

		& a {
			text-decoration: none;
			color: var(--primary-blue);
		}

		&.condensed {
			font-family: var(--header-font-family);
		}
	}
`;

export default {
	Base: {className: styles.ntiText},
	Condensed: {className: cx(styles.ntiText, styles.condensed)}
};
