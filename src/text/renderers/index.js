import './Complex';
import './Markup';
import './PlainText';

import Registry from './Registry';

const registry = Registry.getInstance();

export function getRenderer (props) {
	return registry.getItemFor(props);
}