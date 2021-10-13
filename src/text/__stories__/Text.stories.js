
import { scoped } from '@nti/lib-locale';

import Text from '../View';

const t = scoped('storybook.Text', {
	plain: 'Localized Text',
	complex:
		'String placeholder: %(string)s. Component placeholder: %(component)s.',
});

const Translate = Text.Translator(t);

export default {
	title: 'Typography',
	component: Text,
};

export const Raw = () => <Text>Raw Text</Text>;
export const Base = () => <Text.Base>Base Text Styles</Text.Base>;

export const SimpleTranslate = () => <Translate.Base localeKey="plain" />;
export const ComplexTranslate = () => (
	<Translate.Base
		localeKey="complex"
		with={{
			string: 'string',
			component: <b>Component</b>,
		}}
	/>
);

export const MaxLinesRich = () => (
	<Text linkify limitLines={2}>
		{`<b>Lorem</b> ipsum http://dolor.com sit amet, consectetur adipiscing elit. Aenean vulputate non justo at feugiat. Aenean pellentesque porta ligula, at pulvinar lectus dictum ut. Donec eleifend neque posuere ipsum finibus sagittis. Maecenas ultricies sapien felis, at vestibulum risus ultricies at. Proin imperdiet quam diam, vel feugiat quam fermentum ut. Maecenas blandit nec diam et accumsan. Curabitur eget arcu dignissim, consequat leo in, sodales felis. Suspendisse magna magna, tincidunt at leo non, mattis luctus mauris. Vivamus sagittis nulla eu posuere imperdiet. Duis et quam at ipsum volutpat tristique. Nullam vulputate ante fermentum ligula condimentum fermentum.

Vivamus pretium sollicitudin elit non mollis. Donec sed ligula lectus. Maecenas ac sapien vel eros mollis vestibulum id in lorem. Proin porta varius lorem, a gravida velit elementum quis. Nullam eget ultrices ex. Pellentesque ullamcorper augue et neque pharetra, in sollicitudin odio imperdiet. Vivamus scelerisque, est eu sodales maximus, est justo facilisis libero, ac placerat dui justo vitae erat. Pellentesque semper auctor imperdiet. Sed in varius elit.

Vivamus imperdiet odio nibh, non ultricies tortor ornare sit amet. Praesent vehicula mi sed elit ornare, tincidunt semper urna posuere. Nullam quis ligula sapien. Suspendisse a enim velit. Sed pellentesque, quam et tincidunt sagittis, tellus turpis lacinia sem, a consectetur tellus nisl vel elit. Cras accumsan posuere arcu vitae dapibus. Curabitur vel turpis ac enim ultrices accumsan a ac massa.

Fusce vel euismod risus. Phasellus vestibulum erat id sollicitudin efficitur. Mauris consectetur, lacus ut rhoncus venenatis, neque sem commodo leo, tempor lacinia felis sem vitae nulla. Curabitur ut elit et enim consequat luctus eget eu sapien. Nam iaculis, mauris vitae fermentum pretium, purus nibh blandit sapien, ac interdum erat metus a diam. Sed tincidunt luctus tristique. Duis at magna egestas, posuere nisl quis, dignissim nunc. Nam tempus sed dolor sed tincidunt. In at condimentum orci. Morbi ornare aliquam orci eu consequat. Etiam consectetur, nulla ut convallis malesuada, tellus neque tempus nisi, vel hendrerit elit augue at nisi. Curabitur mattis luctus enim ac luctus. Quisque tincidunt efficitur tellus at mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed metus eros, auctor fringilla congue quis, venenatis nec est. Sed efficitur tellus vitae ultrices tincidunt.

Maecenas nec elit et enim viverra euismod. Aliquam varius mi eget tellus commodo, in pharetra mi elementum. Duis viverra accumsan imperdiet. Vivamus lacus augue, tempor elementum porttitor sit amet, pharetra a elit. Nullam facilisis magna eu dapibus suscipit. Fusce quis lorem pharetra, dictum massa ut, maximus lorem. Maecenas pretium ipsum leo, non lacinia lacus posuere a. Nunc sodales sapien mollis vulputate bibendum. Vestibulum auctor faucibus metus. Aenean porttitor diam a condimentum consectetur.
`}
	</Text>
);
