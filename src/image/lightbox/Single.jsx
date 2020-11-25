import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import * as Icons from '../../icons';
import {Card} from '../../standard-ui';

import styles from './Single.css';

SingleImageLightBox.propTypes = {
	className: PropTypes.string,
	onDismiss: PropTypes.func,
	children: PropTypes.any
};
export default function SingleImageLightBox ({className, onDismiss, children}) {
	return (
		<article className={cx(styles.singleImageLightBox, className)}>
			<header>
				<a className={styles.close} onClick={onDismiss} role="button">
					<Icons.X />
				</a>
			</header>
			<section>
				<Card className={styles.lightBoxContent}>
					{children}
				</Card>
			</section>
		</article>
	);
}
