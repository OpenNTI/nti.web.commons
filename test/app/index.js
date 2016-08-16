/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from 'nti-lib-dom';
import {ConflictResolutionHandler, ContentResources, ControlBar} from '../../src';

import 'normalize.css';
import 'nti-style-common/all.scss';

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

//Kitchen Sink
ReactDOM.render(
	<div className="test-kitchen">
		<ConflictResolutionHandler/>
		<Browser sourceID={ID}/>
		<ControlBarTest />
	</div>,
	document.getElementById('content')
);
