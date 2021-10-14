import { Avatar } from '../components';

/**
 * Convenance helpers to reduce imports on commons if you just need User.x stuff
 *
 * @param {*} props
 * @returns {JSX.Element}
 */
export default function UserAvatar({
	/**
	 * @deprecated use entity instead
	 */
	user,
	...props
}) {
	return <Avatar entity={user} {...props} />;
}
