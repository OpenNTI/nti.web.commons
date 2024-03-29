import cx from 'classnames';

const styles = stylesheet`
	.nti-text {
		font-family: var(--body-font-family);
		white-space: pre-wrap;

		& a {
			text-decoration: none;
			color: var(--primary-blue);
		}
	}

		.condensed {
			font-family: var(--legacy-header-font-family);
		}

		.label {
			font-size: 0.625rem;
			font-weight: bold;
			text-transform: uppercase;
		}

		.primary-grey {
			color: var(--primary-grey);
		}

		.secondary-grey {
			color: var(--secondary-grey);
		}

		.tertiary-grey {
			color: var(--tertiary-grey);
		}

`;

function makeClassVariant(className) {
	return props => {
		const { className: incomingClassName, color, ...otherIncoming } = props;

		return {
			className: cx(incomingClassName, className, color),
			...otherIncoming,
		};
	};
}

export const Colors = {
	primaryGrey: styles.primaryGrey,
	secondaryGrey: styles.secondaryGrey,
	tertiaryGrey: styles.tertiaryGrey,
};

export default {
	Base: makeClassVariant(styles.ntiText),
	Condensed: makeClassVariant(cx(styles.ntiText, styles.condensed)),
	Label: makeClassVariant(cx(styles.ntiText, styles.label)),
};
