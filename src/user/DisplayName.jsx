import { DisplayName } from '../components';

/**
 * Convenience helpers to reduce imports on commons if you just need User.x stuff
 *
 * @param {*} props
 * @returns {JSX.Element}
 */
export default function UserDisplayName({
	/**
	 * @deprecated use entity instead
	 */
	user,
	...props
}) {
	return <DisplayName entity={user} {...props} />;
}
