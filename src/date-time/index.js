import React from 'react';

import DT from './components/DateTime';
import * as components from './components';
import * as utils from './utils';

export default Object.assign((props) => <DT {...props}/>, components, utils);
