import './DarkMode.scss';

import AddClass from './AddClass';

export default function DarkMode() {
	return <AddClass node={document.body} className="darkmode" />;
}
