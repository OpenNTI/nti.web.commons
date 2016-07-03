/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {addFeatureCheckClasses} from 'nti-lib-dom';
import {ConflictResolutionHandler, ContentResources, Errors} from '../../src/index';

import 'normalize.css';
import 'nti-style-common/all.scss';

addFeatureCheckClasses();

global['$AppConfig'] = {server: '/dataserver2/'};

const ID = 'tag:nextthought.com,2011-10:system-OID-0x314663:5573657273:g2p9ZuMqCPF';

const {Browser} = ContentResources;
const {Field: {Factory:ErrorFactory, FlyoutList:ErrorFlyOutList}} = Errors;
const errorFactory = new ErrorFactory();

const errors = [
	errorFactory.make({NTIID: 'Fake 1', label: 'Label 1'}, {message: 'Fake Error 1'}),
	errorFactory.make({NTIID: 'Fake 2', label: 'Label 2'}, {message: 'Fake Error 2'})
];

//Kitchen Sink
ReactDOM.render(
	<div className="test-kitchen">
		<ConflictResolutionHandler/>
		{/*<Browser sourceID={ID}/>*/}
		<ErrorFlyOutList errors={errors} />
	</div>,
	document.getElementById('content')
);
