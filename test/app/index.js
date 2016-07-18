/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from 'nti-lib-dom';
import {ConflictResolutionHandler, ContentResources} from '../../src';

import 'normalize.css';
import 'nti-style-common/all.scss';

addFeatureCheckClasses();

global['$AppConfig'] = {server: '/dataserver2/'};

const ID = 'tag:nextthought.com,2011-10:system-OID-0x314663:5573657273:g2p9ZuMqCPF';

const {Browser} = ContentResources;

//Kitchen Sink
ReactDOM.render(
	<div className="test-kitchen">
		<ConflictResolutionHandler/>
		<Browser sourceID={ID}/>
	</div>,
	document.getElementById('content')
);
