import React from 'react';

import {getGlobalTheme} from './GlobalTheme';

export default React.createContext(getGlobalTheme());