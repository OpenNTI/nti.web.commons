import avatar from './assets/unresolved-user-avatar.png';
import group from './assets/group-avatar.png';

//handle webpack/rollup differences (rollup imports an Image(), webpack imports a string)
export const BLANK_AVATAR = typeof avatar !== 'string' ? avatar.src : avatar;
export const BLANK_GROUP_AVATAR = typeof group !== 'string' ? group.src : group;

export const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
