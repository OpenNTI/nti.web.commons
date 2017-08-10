import {extname} from 'path';
import {parse as parseUrl} from 'url';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import mime from 'mime-types';
import {isNTIID} from 'nti-lib-ntiids';

const CONTENT_TYPE = 'application/vnd.nextthought.content';
const EXTERNAL_TYPE = 'application/vnd.nextthought.externallink';

export default class Icon extends React.Component {

	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,

		src: PropTypes.string,
		href: PropTypes.string,

		svg: PropTypes.bool,

		mimeType: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.arrayOf(PropTypes.string)
		])
	}


	constructor (props) {
		super(props);
		this.setup(props);
	}

	componentWillReceiveProps (nextProps) {
		const prevProps = this.props;

		if (nextProps.href !== prevProps.href || nextProps.mimeType !== prevProps.mimeType) {
			this.setup(nextProps);
		}
	}


	setup (props = this.props) {
		const fallback = !this.getBackgroundImage(props);
		const ext = this.isContent(props) ? '' : this.getFileExtention(props);
		const label = fallback && ext && !/^(www|bin)$/i.test(ext) ? ext : null;
		const cls = fallback && cx('fallback', ext, {
			'content-link': this.isContent(props),
			'unknown': ext === 'bin'
		});

		//eslint-disable-next-line react/no-direct-mutation-state
		const setState = o => this.state ? this.setState(o) : (this.state = o);
		setState({cls, label});
	}


	isContent (props = this.props) {
		return this.getTypes(props).some(x => x === CONTENT_TYPE)
			|| isNTIID(props.href);
	}


	isExternal (props = this.props) {
		return this.getTypes(props).some(x => x === EXTERNAL_TYPE)
			|| !isNTIID(props.href);
	}


	isDocument (props = this.props) {
		return !this.isContent(props)
			&& !this.isExternal(props);
	}


	isEmbeddableDocument (props = this.props) {
		return !this.isDocument(props)
			&& this.getTypes(props).some(x => mime.extension(x) === 'pdf');
	}


	getTypes (props = this.props) {
		const {mimeType} = props;
		return Array.isArray(mimeType) ? mimeType : [mimeType];
	}


	getFileExtention (props = this.props) {
		const types = this.getTypes(props);
		const ext = types.reduce((a, x) => a || mime.extension(x), null);
		const isPlatformType = types.some(x => /nextthought/i.test(x));

		if (!ext && this.isExternal(props) && isPlatformType) {
			return 'www';
		}

		if (!ext || ext === 'bin') {
			return extname(parseUrl(props.href || '').pathname).replace(/\./, '');
		}

		return ext;
	}


	getBackgroundImage (props = this.props) {
		const {src} = props;
		return src && {backgroundImage: `url(${src})`};
	}


	render () {
		const {
			props: {
				children,
				className,
				svg
			},
			state: {
				cls,
				label
			}
		} = this;

		const inlineStyles = this.getBackgroundImage();
		const css = cx('file-type', 'icon', cls, className);

		if (!children && svg) {
			let text = (label && label.length > 5) ? `${label.substr(0,5)}...` : label;
			return (
				<svg className={css} width="300" height="375" viewBox="0 0 80 100">
					{label && (
						<text x="50%" y="90" textAnchor="middle">{text}</text>
					)}
				</svg>
			);
		}

		return (
			<div className={css} style={inlineStyles}>
				{children}
				{label && (<label>{label}</label>)}
			</div>
		);
	}
}
