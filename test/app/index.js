/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from 'nti-lib-dom';
import {ConflictResolutionHandler, ContentResources, ControlBar, Associations} from '../../src';

import 'normalize.css';
import 'nti-style-common/all.scss';

const {createInterfaceForActive, Editor:AssociationsEditor} = Associations;

addFeatureCheckClasses();

global['$AppConfig'] = {server: '/dataserver2/'};

const ID = 'tag:nextthought.com,2011-10:system-OID-0x314663:5573657273:g2p9ZuMqCPF';

const {Browser} = ContentResources;


class ControlBarTest extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			visible: false
		};
	}

	toggleControlBar = () => {
		const {visible} = this.state;

		this.setState({
			visible: !visible
		});
	}


	render () {
		const {visible} = this.state;

		return (
			<div className="control-bar-test">
				<button onClick={this.toggleControlBar}>Toggle Control Bar</button>
				<ControlBar visible={visible}>
					<span>Test App ControlBar</span>
				</ControlBar>
			</div>
		);
	}
}


function createFakeItem (id, name) {
	return {
		MimeType: 'fakeItem',
		NTIID: id,
		label: name
	};
}



const testAssociations = [
	createFakeItem('1', 'Test 1'),
	createFakeItem('2', 'Test 2'),
	createFakeItem('3', 'Test 3'),
	createFakeItem('4', 'Test 4'),
	createFakeItem('5', 'Test 5'),
	createFakeItem('6', 'Test 6'),
	createFakeItem('7', 'Test 7')
];

const testInterface = createInterfaceForActive(['1','3','5','7'], testAssociations, () => {debugger;}, () => {debugger;});


//Kitchen Sink
ReactDOM.render(
	<div className="test-kitchen">
		<AssociationsEditor associations={testInterface}/>
	</div>,
	document.getElementById('content')
);
