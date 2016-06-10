import React from 'react';
import ReactDOM from 'react-dom';

import TimePicker from '../TimePicker';

// Check if it defaults to 12 0
// Check if twentyFourHourTime is false
// check if wrapping works
// check if typed twentyFourHourTime works
// check if wrapping twentyFourHourTime works
// check errors

//Test that passing a value prop and no onChnge handler, the value never updates no matter what the user does. (readonly mode)
//Test that passing a value prop and onChnge handler, the value only updates what the parent passes as the value prop. (normal expected interaction)
//Test that passing no value prop, and onChange the ui updates as user interacts. And onChange calls with new values. (lazy mode)
//Test that no props behaves normally too, but should warn that there isn't a legitimate way of getting values/output.
