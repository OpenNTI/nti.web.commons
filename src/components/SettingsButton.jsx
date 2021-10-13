import './SettingsButton.scss';

export default function SettingsButton(props) {
	return (
		<div className="settings-button" {...props}>
			<i className="icon-settings" />
		</div>
	);
}
