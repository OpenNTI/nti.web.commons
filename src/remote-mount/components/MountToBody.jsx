
import RemoteMountPoint from './RemoteMountPoint';

function getBody() {
	return typeof document === 'undefined' ? null : document.body;
}

export default function MountToBody(props) {
	const body = getBody();

	if (!body) {
		return null;
	}

	return <RemoteMountPoint {...props} appendTo={body} />;
}

//TODO: add a function to take content and render it, with out going through the high order component
