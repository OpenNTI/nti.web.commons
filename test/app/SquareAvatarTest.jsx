import React from 'react';
import classnames from 'classnames/bind';

import {Avatar} from '../../src';

import styles from './SquareAvatarTest.css';

const cx = classnames.bind(styles);

const entities = [
	{
		avatarURL: 'https://placekitten.com/180/180'
	},
	{
		avatarURL: 'https://placekitten.com/180/360'
	},
	{
		avatarURL: 'https://placekitten.com/480/200'
	},
];

export default class SquareAvatarTest extends React.Component {
	render () {
		return (
			<div>
				{entities.map(e => (
					<div key={e.avatarURL} className={cx('wrapper')}>
						<img src={e.avatarURL} />
						<Avatar entity={e} />
						<Avatar entity={e} letterbox="none" />
						<Avatar entity={e} letterbox="src" />
						<Avatar entity={e} letterbox="rgba(255, 0, 0, 0.5)" />
					</div>
				))}
			</div>
		);
	}
}

