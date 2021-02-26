import { generator } from './generator';

const ContainerPlaceholder = styled.div`
	/* this doesn't do anything, it's just example */
	--container: true;
`;

export const Container = generator(ContainerPlaceholder);
