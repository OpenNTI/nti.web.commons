/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';

import {Flyout} from '../../src';
import {DateIcon} from '../../src/calendar';

import Gutter from './Gutter';

// import PropTypes from 'prop-types';
// import {addFeatureCheckClasses} from '@nti/lib-dom';

// class Button extends React.Component {
// 	ref = React.createRef()
//
// 	getDOMNode () {
// 		return this.ref.current;
// 	}
//
// 	render () {
// 		return <button {...this.props} ref={this.ref}>hi</button>;
// 	}
// }

// function Test () {
// 	return (
// 		<div>
// 			<Flyout.Triggered trigger={Button}>
// 				Hi
// 			</Flyout.Triggered>
// 		</div>
// 	);
// }

function CalendarTest () {
	const Icon = React.forwardRef((props, ref) => <DateIcon badge={4} {...props} ref={ref} />);

	return (
		<Gutter>
			<Flyout.Triggered trigger={Icon} horizontalAlign={Flyout.ALIGNMENTS.LEFT} verticalAlign={Flyout.ALIGNMENTS.TOP}>
				<div>oh hai.</div>
			</Flyout.Triggered>
		</Gutter>
	);
}

ReactDOM.render(
	<CalendarTest />,
	document.getElementById('content')
);
