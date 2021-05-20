import React from 'react';
import PropTypes from 'prop-types';

import * as Icons from '../index';

const CmpNameBlackList = new Set([
	'__docgenInfo',
	'propTypes',
	'$$typeof',
	'render'
]);

const PropVariants = new Set([
	'fill',
	'large',
	'skinny'
]);

const Grid = styled('ul')`
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;

	& > li {
		display: inline-block;
		box-shadow: 0 0 0 1px var(--border-grey-light);
	}
`;

const GridCmpItem = styled('div')`
	width: 200px;
	height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: visible;
`;

const GridCmpLabel = styled('span')`
	color: var(--secondary-grey);
	font-size: 14px;
	text-align: center;
	display: block;
`;

const Wrapper = ({fontSize = 16, color = 'var(--secondary-grey)', ...otherProps}) => {
	const style = {
		fontSize: `${fontSize}px`,
		color
	};

	return (
		<div style={style} {...otherProps} />
	);
};

Wrapper.propTypes = {
	fontSize: PropTypes.number,
	color: PropTypes.string
};

const wrap = (Cmp) => {
	const render = (props) => (
		<Wrapper {...props}>
			<Cmp />
		</Wrapper>
	);

	render.component = Cmp;

	return render;
};

export default {
	title: 'Icons',
	argTypes: {
		fontSize: {control: {type: 'range', min: 8, max: 36, step: 4}},
		color: {control: {type: 'color'}}
	}
};

const getVariants = (Cmp, name) => {
	const variants = [{name, cmp: (<Cmp />)}];

	for (let prop of Object.keys(Cmp.propTypes ?? {})) {
		if (PropVariants.has(prop)) {
			variants.push({
				name: `${name} (${prop}=true)`,
				cmp: (<Cmp {...{[prop]: true}} />)
			});
		}
	}

	return variants;
};

const IconCmps = (Object.entries(Icons))
	.reduce((acc, [name, Cmp]) => {
		if (CmpNameBlackList.has(name)) { return acc; }

		acc = [...acc, ...getVariants(Cmp, name)];

		for (let [subName, SubCmp] of Object.entries(Cmp)) {
			if (!CmpNameBlackList.has(subName)) {
				acc = [...acc, ...getVariants(SubCmp, `${name}.${subName}`)];
			}
		}

		return acc;
	}, []);


export const All = (props) => {
	return (
		<Wrapper {...props}>
			<Grid>
				{IconCmps.map(cmp => (
					<li key={cmp.name}>
						<GridCmpItem>
							{cmp.cmp}
						</GridCmpItem>
						<GridCmpLabel>{cmp.name}</GridCmpLabel>
					</li>
				))}
			</Grid>
		</Wrapper>
	);
};

export const Add = wrap(Icons.Add);
export const AddCircled = wrap(Icons.Add.Circled);

export const Alert = wrap(Icons.Alert);
export const AlertRound = wrap(Icons.Alert.Round);

export const Arrow = wrap(Icons.Arrow);
export const ArrowUp = wrap(Icons.Arrow.Up);
export const ArrowUpRight = wrap(Icons.Arrow.UpRight);
export const ArrowDown = wrap(Icons.Arrow.Down);


