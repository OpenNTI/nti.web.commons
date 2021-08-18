export const Base = styled.div`
	&.flat {
		background-color: #e2e2e2;
	}

	&:not(.flat) {
		animation: shimmer 2s infinite;
		background: linear-gradient(
			105deg,
			var(--panel-background-alt, #e2e2e2) 40%,
			white 50%,
			var(--panel-background-alt, #e2e2e2) 60%
		);
		background-size: 1000px 100%;
		background-attachment: fixed;
		/* Turn on GPU Rendering */
		transform: rotateZ(360deg);
	}

	@keyframes shimmer {
		0% {
			background-position: -1000px 0;
		}

		100% {
			background-position: 1000px 0;
		}
	}
`;
