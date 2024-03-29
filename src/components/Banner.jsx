import './Banner.scss';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ItemChanges } from '../mixins';
import { Asset } from '../presentation-assets';

export default createReactClass({
	displayName: 'Content:Banner',
	mixins: [ItemChanges],

	propTypes: {
		children: PropTypes.node,
		className: PropTypes.string,

		/**
		 * Any model that implements getPresentationProperties()
		 *
		 * @type {object}
		 */
		item: PropTypes.shape({
			CatalogEntry: PropTypes.any,
			getPresentationProperties: PropTypes.func,
		}).isRequired,

		preferBackground: PropTypes.bool,
	},

	render() {
		const { children, className, item, preferBackground } = this.props;
		if (!item) {
			return null;
		}
		const p = item.getPresentationProperties();

		return (
			<div className={cx('content-banner', className)}>
				<Asset
					contentPackage={(item && item.CatalogEntry) || item}
					type={preferBackground ? 'background' : 'landing'}
				>
					<img />
				</Asset>
				<label>
					<h3>{p.title}</h3>
					<h5>{p.label}</h5>
				</label>
				{children}
			</div>
		);
	},
});
