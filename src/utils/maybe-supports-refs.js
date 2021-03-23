import React from 'react';

export const maybeSupportsRefs = x =>
	x && ('$$typeof' in x || Object.getPrototypeOf(x) === React.Component);
