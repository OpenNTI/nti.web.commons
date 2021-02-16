import './PillToolTip.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { List, Loading } from '../../../components';

export default class PillToolTip extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			associationCount: PropTypes.number,
			getAssociations: PropTypes.func,
		}).isRequired,
		scope: PropTypes.object,
		onShow: PropTypes.func,
		getString: PropTypes.func,
		className: PropTypes.string,
	};

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
		const { item, scope } = this.props;

		this.loadAssociations(item, scope);
	}

	loadAssociations(item, scope) {
		this.setState({
			loading: true,
		});

		item.getAssociations(scope).then(associations => {
			this.setState({
				loading: false,
				associations,
			});
		});
	}

	showMore = () => {
		const { onShow } = this.props;

		if (onShow) {
			onShow();
		}
	};

	render() {
		const { getString, className } = this.props;
		const { loading, associations } = this.state;
		const children = (associations || []).map(x => x.title || x.label);

		return (
			<div
				className={cx('association-pill-tooltip', className, {
					loading,
				})}
			>
				{loading ? (
					<Loading.Spinner white size="20px" />
				) : (
					<List.Limited
						className="association-pill-tooltip-list"
						onShowMore={this.showMore}
						max={3}
						getString={getString}
					>
						{children}
					</List.Limited>
				)}
			</div>
		);
	}
}
