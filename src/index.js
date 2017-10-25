export * from './components';
// once all old references to ConflictResolutionHandler are cleaned up just
// change import to export and delete the back-compat block below.
import * as ConflictResolution from './conflict-resolution';
export * as Associations from './associations';
export * as Constants from './constants';
export * as DnD from './drag-and-drop';
export * as Errors from './errors';
export * as Flyout from './flyout';
export * as HOC from './HighOrderComponents';
export * as Mixins from './mixins';
export * as Presentation from './presentation-assets';
export * as Prompt from './prompts';
export * as RemoteMount from './remote-mount';
export * as Selection from './selection';
export * as Switch from './switch';

//back-compat begin
export const ConflictResolutionHandler = ConflictResolution.Component;
export {ConflictResolution};
//back-compat end
