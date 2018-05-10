/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';

// import PropTypes from 'prop-types';
// import {addFeatureCheckClasses} from '@nti/lib-dom';
import {Flyout} from '../../src';

class Button extends React.Component {
	ref = React.createRef()

	getDOMNode () {
		return this.ref.current;
	}

	render () {
		return <button {...this.props} ref={this.ref}>hi</button>;
	}
}

function Test () {
	return (
		<div>
			<Flyout.Triggered trigger={Button}>
				Hi
			</Flyout.Triggered>
		</div>
	);
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);
