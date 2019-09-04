import Complex from './Complex';
import Markup from './Markup';
import PlainText from './PlainText';
import Registry from './Registry';

const registry = Registry.getInstance();

export const Types = {Complex, Markup, PlainText};

export function getRenderer (props) {
	return registry.getItemFor(props);
}