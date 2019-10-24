/*eslint no-console: 0*/
import React from 'react';
import ReactDOM from 'react-dom';

// import PropTypes from 'prop-types';
// import {addFeatureCheckClasses} from '@nti/lib-dom';
import {Navigation, Layouts} from '../../../src';

Layouts.Responsive.setWebappContext();

class Test extends React.Component {
	state = {active: 3}

	render () {
		const {active} = this.state;

		return (
			<div>
				<div>
					<Navigation />
				</div>
				<Navigation.Tabs>
					<Navigation.Tabs.Tab
						route="./activity"
						label="Activity"
						active={active === 0}
					/>
					<Navigation.Tabs.Tab
						route="./lessons"
						label="Lessons"
						active={active === 1}
					/>
					<Navigation.Tabs.Tab
						route="./discussions"
						label="Discussions"
						active={active === 2}
					/>
					<Navigation.Tabs.Tab
						route="./assignments"
						label="Assignments"
						active={active === 3}
					/>
					<Navigation.Tabs.Tab
						route="./course-info"
						label="Course Info"
						active={active === 4}
					/>
				</Navigation.Tabs>

				<input type="radio" name="active-tab" value={active === 0} onChange={() => this.setState({active: 0})} />
				<input type="radio" name="active-tab" value={active === 1} onChange={() => this.setState({active: 1})} />
				<input type="radio" name="active-tab" value={active === 2} onChange={() => this.setState({active: 2})} />
				<input type="radio" name="active-tab" value={active === 3} onChange={() => this.setState({active: 3})} />
				<input type="radio" name="active-tab" value={active === 4} onChange={() => this.setState({active: 4})} />
			</div>
		);
	}
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);
