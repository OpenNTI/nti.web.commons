import './DarkMode.scss';
import React from 'react';

import AddClass from './AddClass';

export default function DarkMode () {
	return <AddClass node={document.body} className="darkmode" />;
}
