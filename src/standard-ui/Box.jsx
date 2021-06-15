export const Box = styled.div`
	&.p-sm {
		padding: var(--padding-sm);
	}
	&.p-md {
		padding: var(--padding-md);
	}
	&.p-lg {
		padding: var(--padding-lg);
	}
	&.p-xl {
		padding: var(--padding-xl);
	}

	&.pb-sm {
		padding-block-start: var(--padding-sm);
		padding-block-end: var(--padding-sm);
	}
	&.pb-md {
		padding-block-start: var(--padding-md);
		padding-block-end: var(--padding-md);
	}
	&.pb-lg {
		padding-block-start: var(--padding-lg);
		padding-block-end: var(--padding-lg);
	}
	&.pb-xl {
		padding-block-start: var(--padding-xl);
		padding-block-end: var(--padding-xl);
	}

	&.sh-sm {
		box-shadow: var(--box-shadow-sm);
	}
	&.sh-md {
		box-shadow: var(--box-shadow-md);
	}
	&.sh-lg {
		box-shadow: var(--box-shadow-lg);
	}
`;

Box.defaultProps = {
	// p: 'sm',
	// sh: 'sm',
};
