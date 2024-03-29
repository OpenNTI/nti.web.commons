import './AssetIcon.scss';
import { extname } from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import mime from 'mime-types';

import { isNTIID } from '@nti/lib-ntiids';

import GoogleAppDocs from './assets/file-types/google-app-docs.svg';
import GoogleAppForm from './assets/file-types/google-app-form.svg';
import GoogleAppSheets from './assets/file-types/google-app-sheets.svg';
import GoogleAppSlides from './assets/file-types/google-app-slides.svg';

const CONTENT_TYPE = 'application/vnd.nextthought.content';
const EXTERNAL_TYPE = 'application/vnd.nextthought.externallink';
const EXTERNAL_TOOLS = ['application/vnd.nextthought.ltiexternaltoolasset'];
const SCORM_TYPE = 'application/vnd.nextthought.scormcontentref';

const GoogleAppAssets = {
	'application/vnd.google-apps.document': GoogleAppDocs,
	'application/vnd.google-apps.form': GoogleAppForm,
	'application/vnd.google-apps.spreadsheet': GoogleAppSheets,
	'application/vnd.google-apps.presentation': GoogleAppSlides,
};

const CustomTypeClasses = {
	'application/vnd.google-apps.document': 'google-app-docs',
	'application/vnd.google-apps.form': 'google-app-form',
	'application/vnd.google-apps.spreadsheet': 'google-app-sheets',
	'application/vnd.google-apps.presentation': 'google-app-slides',
};

export default class Icon extends React.Component {
	static getGoogleAppAsset(mimeType) {
		return GoogleAppAssets[mimeType];
	}

	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,

		src: PropTypes.string,
		href: PropTypes.string,

		svg: PropTypes.bool,

		mimeType: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.arrayOf(PropTypes.string),
		]),
	};

	constructor(props) {
		super(props);
		this.setup(props);
	}

	componentDidUpdate(prevProps) {
		const nextProps = this.props;

		if (
			nextProps.href !== prevProps.href ||
			nextProps.mimeType !== prevProps.mimeType ||
			nextProps.src !== prevProps.src
		) {
			this.setup(nextProps);
		}
	}

	setup(props = this.props) {
		const fallback = !this.getBackgroundImage(props);
		const ext =
			this.isContent(props) &&
			!this.isExternalTool(props) &&
			!this.isScorm(props)
				? ''
				: this.getFileExtension(props);
		const label = fallback && ext && !/^(www|bin)$/i.test(ext) ? ext : null;

		const cls =
			fallback &&
			cx('fallback', this.getTypeClass(props) || ext, {
				'content-link': this.isContent(props),
				'scorm-content': this.isScorm(props),
				unknown: ext === 'bin',
			});

		const setState = o =>
			//eslint-disable-next-line react/no-direct-mutation-state
			this.state ? this.setState(o) : (this.state = o);
		setState({ cls, label });
	}

	isContent(props = this.props) {
		return (
			this.getTypes(props).some(x => x === CONTENT_TYPE) ||
			isNTIID(props.href)
		);
	}

	isExternal(props = this.props) {
		return (
			this.getTypes(props).some(x => x === EXTERNAL_TYPE) ||
			!isNTIID(props.href)
		);
	}

	isExternalTool(props = this.props) {
		return this.getTypes(props).some(x => EXTERNAL_TOOLS.includes(x));
	}

	isDocument(props = this.props) {
		return !this.isContent(props) && !this.isExternal(props);
	}

	isScorm(props = this.props) {
		return this.getTypes(props).some(x => x === SCORM_TYPE);
	}

	isEmbedableDocument(props = this.props) {
		return (
			!this.isDocument(props) &&
			this.getTypes(props).some(x => mime.extension(x) === 'pdf')
		);
	}

	getTypeClass(props) {
		const types = this.getTypes(props);

		for (let t of types) {
			const cls = CustomTypeClasses[t];

			if (cls) {
				return cls;
			}
		}
	}

	getTypes(props = this.props) {
		const { mimeType } = props;
		return Array.isArray(mimeType) ? mimeType : [mimeType];
	}

	getFileExtension(props = this.props) {
		const types = this.getTypes(props);
		const ext = types.reduce((a, x) => a || mime.extension(x), null);
		const isPlatformType = types.some(x => /nextthought/i.test(x));

		if (
			!ext &&
			(this.isExternal(props) || this.isExternalTool(props)) &&
			isPlatformType
		) {
			return 'www';
		}

		if (!ext || ext === 'bin') {
			try {
				return extname(
					new URL(props.href || '', document.URL).pathname
				).replace(/\./, '');
			} catch {
				return 'bin';
			}
		}

		return ext;
	}

	getBackgroundImage(props = this.props) {
		const { src } = props;
		return src && { backgroundImage: `url(${src})` };
	}

	render() {
		const {
			props: { children, className, svg },
			state: { cls, label },
		} = this;

		const inlineStyles = this.getBackgroundImage();
		const css = cx('file-type', 'icon', cls, className);

		if (!children && svg) {
			let text =
				label && label.length > 5 ? `${label.substr(0, 5)}...` : label;
			return (
				<svg
					className={css}
					width="300"
					height="375"
					viewBox="0 0 80 100"
				>
					{label && (
						<text x="50%" y="90" textAnchor="middle">
							{text}
						</text>
					)}
				</svg>
			);
		}

		return (
			<div className={css} style={inlineStyles || {}}>
				{children}
				{label && <label>{label}</label>}
			</div>
		);
	}
}
