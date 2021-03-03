const Notice = styled('figure').attrs(props => ({
	...props,
	small: props.className?.includes?.('small'),
}))`
	margin: 1rem;
	padding: 2rem 1rem;
	background: var(--panel-background);
	color: var(--secondary-grey);
	border: 1px solid var(--border-grey);
	border-radius: 2px;
	word-break: break-word;
	word-wrap: break-word;

	&.small {
		font-size: 0.6875rem;
		padding: 0.25rem;
	}
`;

export default Notice;
