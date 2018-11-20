/*eslint no-console: 0*/
import React from 'react';
// import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

// import PropTypes from 'prop-types';
// import {addFeatureCheckClasses} from '@nti/lib-dom';
import {ZoomableContent} from '../../src';

class Test extends React.Component {
	render () {
		return (
			<div style={{width: '500px', height: '500px'}}>
				<ZoomableContent>
					<img src="https://picsum.photos/2000/3000" />
				</ZoomableContent>
			</div>
		);
	}
}

setTimeout(() => {
	ReactDOM.render(
		<Test />,
		document.getElementById('content')
	);
}, 1000);
