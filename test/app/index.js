import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from '@nti/lib-dom';
import '@nti/style-common/variables.css';

import Test from './Text';

addFeatureCheckClasses();

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);

