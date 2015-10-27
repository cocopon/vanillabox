const Util = require('./util.js');

/**
 * @namespace
 */
const Animation = {};

Animation.None = {
	showMask: (mask) => {
		return mask.getElement().show().promise();
	},

	hideMask: (mask) => {
		return mask.getElement().hide();
	},

	showFrame: (frame) => {
		Animation.None.resizeFrame(frame);
		return frame.getElement().show().promise();
	},

	hideFrame: (frame) => {
		return frame.getElement().hide();
	},

	resizeFrame: (frame) => {
		const container = frame.getContainer();
		const containerSize = container.getSize();
		const offset = frame.getPreferredOffset(containerSize);

		container.getElement().css({
			width: containerSize.width,
			height: containerSize.height
		});

		frame.getElement().css({
			left: offset.left,
			top: offset.top
		});

		return Util.Deferred.emptyPromise();
	},

	showContent: (content) => {
		return content.getElement().show().promise();
	},

	hideContent: (content) => {
		return content.getElement().hide().promise();
	}
};

Animation.Default = {
	showMask: (mask) => {
		return mask.getElement().fadeIn(200).promise();
	},

	hideMask: (mask) => {
		return mask.getElement().fadeOut(300).promise();
	},

	animateFrame_: (frame, containerSize, offset, duration) => {
		const container = frame.getContainer();
		const containerElem = container.getElement();
		containerElem.stop();
		const containerPromise = containerElem.animate({
			width: containerSize.width,
			height: containerSize.height
		}, duration);

		const frameElem = frame.getElement();
		frameElem.stop();
		const framePromise = frameElem.animate({
			left: offset.left,
			top: offset.top
		}, duration);

		return $.when(
			containerPromise,
			framePromise
		);
	},

	showFrame: (frame) => {
		const container = frame.getContainer();
		const containerSize = container.getSize();
		const offset = frame.getPreferredOffset(containerSize);

		container.getElement().css({
			width: containerSize.width,
			height: containerSize.height
		});

		frame.getElement().css({
			left: offset.left,
			top: offset.top
		});

		return Util.Deferred.emptyPromise();
	},

	hideFrame: () => {
		return Util.Deferred.emptyPromise();
	},

	resizeFrame: (frame) => {
		const container = frame.getContainer();
		const containerSize = container.getSize();
		const offset = frame.getPreferredOffset(containerSize);

		return Animation.Default.animateFrame_(
			frame,
			containerSize,
			offset,
			300
		);
	},

	showContent: (content) => {
		return content.getElement().fadeIn(200).promise();
	},

	hideContent: (content) => {
		return content.getElement().fadeOut(300).promise();
	}
};

module.exports = Animation;
