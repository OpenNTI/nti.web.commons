const Elem = styled.div`
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

const defaults = {
	// p: 'sm',
	// sh: 'sm',
};

export const Box = props => <Elem {...{ ...defaults, ...props }} />;
