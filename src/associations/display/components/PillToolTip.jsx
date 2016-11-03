import React from 'react';
import cx from 'classnames';

import {List, Loading} from '../../../components';

export default class PillToolTip extends React.Component {
	static propTypes = {
		item: React.PropTypes.shape({
			associationCount: React.PropTypes.number,
			getAssociations: React.PropTypes.func
		}).isRequired,
		scope: React.PropTypes.object,
		onShow: React.PropTypes.func,
		getString: React.PropTypes.func,
		className: React.PropTypes.string
	}

	constructor (props) {
		super(props);

		this.state = {
			loading: true
		};
	}


	componentDidMount () {
		const {item, scope} = this.props;

		this.loadAssociations(item, scope);
	}


	loadAssociations (item, scope) {
		this.setState({
			loading: true
		});

		item.getAssociations(scope)
			.then((associations) => {
				this.setState({
					loading: false,
					associations
				});
			});
	}


	showMore = () => {
		const {onShow} = this.props;

		if (onShow) {
			onShow();
		}
	}


	render () {
		const {getString, className} = this.props;
		const {loading, associations} = this.state;
		const cls = cx('association-pill-tooltip', className, {loading});
		const children = (associations || []).map(x => x.title || x.label);

		return (
			<div className={cls}>
				{
					loading ?
						(<Loading.Spinner white size="20px" />) :
						(
							<List.Limited
								className="association-pill-tooltip-list"
								onShowMore={this.showMore}
								children={children} max={3}
								getString={getString}
							/>
						)
				}
			</div>
		);
	}
}
