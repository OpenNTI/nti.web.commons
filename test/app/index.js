import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from '@nti/lib-dom';
import '@nti/style-common/variables.css';

import Demos from './Demos';

addFeatureCheckClasses();

ReactDOM.render(
	<Demos />,
	document.getElementById('content')
);
