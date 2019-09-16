//aspectRatio: width / height
import fitsAspectRatio from './fits-aspect-ratio';

const DefaultLetterBox = 'color';
const LetterBoxAppliers = {
	'none': () => {},
	'transparent': () => {},

	'src': (ctx, image) => {
		const {naturalWidth: imageWidth, naturalHeight: imageHeight} = image;
		const {width, height} = ctx;
		const actualScale = imageWidth === width ? (height / imageHeight) : (width / imageWidth);
		const scale = Math.max(actualScale, 3);

		const scaledWidth = imageWidth * scale;
		const scaledHeight = imageHeight * scale;

		ctx.save();
		ctx.translate(width / 2, height / 2);
		ctx.globalAlpha = 0.5;
		ctx.drawImage(image, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
		ctx.restore();
	},

	[DefaultLetterBox]: (ctx, image, color) => {
		ctx.save();
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, ctx.width, ctx.height);
		ctx.restore();
	}
};

function fixDimensions (width, height, aspectRatio) {
	if (width >= height) {
		return {
			width,
			height: width / aspectRatio
		};
	}

	return {
		width: aspectRatio * height,
		height
	};
}

function applyLetterBox (ctx, image, type) {
	if (!type) { return; }

	const applier = LetterBoxAppliers[type] || LetterBoxAppliers[DefaultLetterBox];

	return applier(ctx, image, type);
}

export default function getFixedImageSrc (image, aspectRatio, letterbox) {
	if (!image) { return null; }
	if (typeof document === 'undefined') { return image && image.src; }
	if (fitsAspectRatio(image, aspectRatio)) { return image.src; }

	const {naturalWidth: imageWidth, naturalHeight: imageHeight} = image;

	const {width, height} = fixDimensions(imageWidth, imageHeight, aspectRatio);

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = ctx.width = width;
	canvas.height = ctx.height = height;

	applyLetterBox(ctx, image, letterbox);

	ctx.translate(width / 2, height / 2);
	ctx.drawImage(image, -imageWidth / 2, -imageHeight / 2);

	return canvas.toDataURL();
}