import React from 'react';

export const maybeSupportsRefs = x => '$$typeof' in x || Object.getPrototypeOf(x) === React.Component;
