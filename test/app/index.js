/*eslint no-console: 0*/
// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
// import {addFeatureCheckClasses} from 'nti-lib-dom';
// import {ConflictResolutionHandler, ContentResources, ControlBar, Associations, Button, TimePicker} from '../../src';

import {Layouts} from '../../src';

const {Responsive} = Layouts;

const SIZES = [
	{height: 100, background: 'red'},
	{height: 250, background: 'green'},
	{height: 500, background: 'blue'},
	{height: 750, background: 'yellow'},
	{height: 1000, background: 'orange'},
	{height: '110vh', background: 'pink'}
];

const REMEMBER = {};

function getSize (page) {
	if (!REMEMBER[page]) {
		const max = SIZES.length;
		const index = Math.floor(Math.random() * (max - 1));

		REMEMBER[page] = SIZES[index];
	}

	return REMEMBER[page];
}

// class Store {
// 	getTotalCount () {
// 		return 1000;
// 	}

// 	loadPage (page) {
// 		return {
// 			page: page
// 		};
// 	}

// 	cancelLoadPage () {}
// }

// const StoreInstance = new Store();


// Page.propTypes = {
// 	page: PropTypes.object,
// 	loading: PropTypes.bool
// };
// function Page ({page, loading}) {
// 	const size = page && getSize(page.page);

// 	return (
// 		<div style={size}>
// 			{loading && (<span>Loading</span>)}
// 			{!loading && (<span>{page.page}</span>)}
// 		</div>
// 	);
// }


function renderPage (index) {
	const size = getSize(index);

	return (
		<div style={size}>
			<span>{index}</span>
		</div>
	);
}

function Test () {
	return (
		<div>
			<InfiniteLoad.List
				totalPages={1000}
				renderPage={renderPage}
				defaultPageHeight={500}
			/>
		</div>
	);
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);


// const {Interface, openEditorModal} = Associations;

// addFeatureCheckClasses();

// global['$AppConfig'] = {server: '/dataserver2/'};

// const ID = 'tag:nextthought.com,2011-10:system-OID-0x314663:5573657273:g2p9ZuMqCPF';

// const {Browser} = ContentResources;


// class ControlBarTest extends React.Component {
// 	constructor (props) {
// 		super(props);

// 		this.state = {
// 			visible: false
// 		};
// 	}

// 	toggleControlBar = () => {
// 		const {visible} = this.state;

// 		this.setState({
// 			visible: !visible
// 		});
// 	}


// 	render () {
// 		const {visible} = this.state;

// 		return (
// 			<div className="control-bar-test">
// 				<button onClick={this.toggleControlBar}>Toggle Control Bar</button>
// 				<ControlBar visible={visible}>
// 					<span>Test App ControlBar</span>
// 				</ControlBar>
// 			</div>
// 		);
// 	}
// }

// const active = ['1', '6', '7', '10'];
// let testInterface;

// function onAdd (item) {
// 	testInterface.addActive(item);
// }

// function onRemove (item) {
// 	testInterface.removeActive(item);
// }


// function createFakeItem (id, name) {
// 	return Interface.createItem({
// 		MimeType: 'fakeItem',
// 		NTIID: id,
// 		label: name
// 	}, onAdd, onRemove);
// }

// const testAssociations = [
// 	Interface.createGroup('Group 1', [
// 		createFakeItem('1', 'Foo Test 1'),
// 		createFakeItem('2', 'Bar Test 1'),
// 		createFakeItem('3', 'Foo Test 2'),
// 		createFakeItem('4', 'Bar Test 2'),
// 	]),
// 	Interface.createGroup('Group 2', [
// 		createFakeItem('5', 'Foo Test 3'),
// 		createFakeItem('6', 'Bar Test 3'),
// 		createFakeItem('7', 'Foo Test 4'),
// 		createFakeItem('8', 'Bar Test 4'),
// 	]),
// 	Interface.createGroup('Group 3', [
// 		createFakeItem('9', 'Foo Test 5'),
// 		createFakeItem('11', 'Foo Test 6'),
// 		createFakeItem('13', 'Foo Test 7'),
// 		createFakeItem('15', 'Foo Test 8'),
// 	]),
// 	Interface.createGroup('Group 4', [
// 		createFakeItem('10', 'Bar Test 5'),
// 		createFakeItem('12', 'Bar Test 6'),
// 		createFakeItem('14', 'Bar Test 7'),
// 		createFakeItem('16', 'Bar Test 8'),
// 	])
// ];

// testInterface = new Interface(testAssociations, active);

// function openEditor () {
// 	openEditorModal('Test Associations', testInterface);
// }

// class TestCmp extends React.Component {
// 	state = {value: 0}

// 	onChange = (value) => {
// 		this.setState({value});
// 	}

// 	render () {
// 		const {value} = this.state;

// 		return (
// 			<TimePicker value={value} onChange={this.onChange} />
// 		);
// 	}
// }


// //Kitchen Sink
// ReactDOM.render(
// 	<div className="test-kitchen">
// 		<button onClick={openEditor}>Open Editor</button>
// 		<TestCmp />
// 	</div>,
// 	document.getElementById('content')
// );
