import PanelButton from '../PanelButton';

export default {
	title: 'Components/PanelButton',
	component: PanelButton,
};

export const RightIcon = () => (
	<PanelButton onClick={() => null} linkText="Submit Payment">
		<h3>Foo bar</h3>
		<p>
			Aliqua in occaecat esse ullamco qui dolor est dolore. Laboris
			laborum consequat exercitation qui consequat officia occaecat
			deserunt consequat occaecat commodo ex voluptate occaecat. Sit magna
			dolor excepteur magna ex nulla consectetur incididunt. In quis
			tempor ut adipisicing non Lorem qui adipisicing aliquip proident
			sunt sunt. Incididunt eu dolor consequat Lorem excepteur voluptate
			adipisicing anim tempor magna incididunt ullamco.
		</p>
	</PanelButton>
);
