import Chooser from './Chooser';
export { default as Browser } from './Browser';

/**
 * Open a Resource Browser-Picker. Currently only allowing a single item to be selected.
 *
 * @param  {string} sourceID - an NTIID of the resource provider. (eg: CourseInstance)
 * @param  {Function} [accept] - A callback that inspects a File/Folder. Return true to make it selectable.
 * @param  {Function} [filter] - A callback that inspects a File/Folder. Return falsy to remove it from
 *                           the list. Truthy to include it.
 * @param  {string} [labelOfButton='Place'] - Sets the label on the "Accept/Select" blue button.
 * @returns {Promise} Will fulfill with the File(s) or Folder(s) object the user selected.
 */
export function selectFrom(sourceID, accept, filter, labelOfButton = 'Place') {
	return Chooser.show(sourceID, accept, filter, labelOfButton);
}
