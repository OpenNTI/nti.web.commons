import React from 'react';

import { Slot } from '../Slot';

export default {
	title: 'Layouts/Slot',
	component: Slot,
};

const NamedWrapper = props => (
	<div>
		<header>
			<Slot slot="header" {...props} />
		</header>
		<article>
			<Slot slot="article" {...props} />
		</article>
		<footer>
			<Slot slot="footer" {...props} />
		</footer>
		<div>
			<h3>Other:</h3>
			<Slot {...props} />
		</div>
	</div>
);

export const Named = () => (
	<NamedWrapper>
		<div slot="header">Header</div>
		<div slot="header">Header2</div>
		<div slot="footer">Footer</div>
		<div slot="article">Article</div>
		<div>Not slotted</div>
		<div>Not slotted either</div>
	</NamedWrapper>
);

const Header = props => <header {...props} />;
const Article = props => <article {...props} />;
const Footer = props => <footer {...props} />;

const SubComponentsWrapper = props => (
	<div>
		<Slot {...props} slot={Header} />
		<Slot {...props} slot={Article} />
		<Slot {...props} slot={Footer} />
		<div>
			<h3>Other:</h3>
			<Slot {...props} exclude={[Header, Article, Footer]} />
		</div>
	</div>
);

export const SubComponents = () => (
	<SubComponentsWrapper>
		<Header>Header Component</Header>
		<Footer>Footer Component</Footer>
		<Article>Article Component</Article>
		<div>Other Component</div>
	</SubComponentsWrapper>
);
