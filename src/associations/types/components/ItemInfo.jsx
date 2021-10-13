import './ItemInfo.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

function renderSubLabel(label, index) {
	return <span key={index}>{label}</span>;
}

function renderSubLabels(labels) {
	return <div className="sub-labels">{labels.map(renderSubLabel)}</div>;
}

AssociationItemInfo.propTypes = {
	label: PropTypes.string,
	subLabels: PropTypes.array,
};
export default function AssociationItemInfo({ label, subLabels = [] }) {
	const hasSubLabels = subLabels && subLabels.length;
	const cls = cx('association-item-info', { 'has-sub-labels': hasSubLabels });

	return (
		<div className={cls}>
			<span className="label">{label}</span>
			{hasSubLabels && renderSubLabels(subLabels)}
		</div>
	);
}
