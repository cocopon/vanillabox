/**
 * @namespace
 */
var Animation = {};

Animation.None = {
	showMask: function(mask) {
		return mask.getElement().show().promise();
	},

	hideMask: function(mask) {
		return mask.getElement().hide();
	},

	showFrame: function(frame) {
		Animation.None.resizeFrame(frame);
		return frame.getElement().show().promise();
	},

	hideFrame: function(frame) {
		return frame.getElement().hide();
	},

	resizeFrame: function(frame) {
		var container = frame.getContainer();
		var containerSize = container.getSize();
		var offset = frame.getPreferredOffset(containerSize);

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

	showContent: function(content) {
		return content.getElement().show().promise();
	},

	hideContent: function(content) {
		return content.getElement().hide().promise();
	}
};

Animation.Default = {
	showMask: function(mask) {
		return mask.getElement().fadeIn(200).promise();
	},

	hideMask: function(mask) {
		return mask.getElement().fadeOut(300).promise();
	},

	animateFrame_: function(frame, containerSize, offset, duration) {
		var container = frame.getContainer();
		var containerElem = container.getElement();
		var containerPromise;
		containerElem.stop();
		containerPromise = containerElem.animate({
			width: containerSize.width,
			height: containerSize.height
		}, duration);

		var frameElem = frame.getElement();
		var framePromise;
		frameElem.stop();
		framePromise = frameElem.animate({
			left: offset.left,
			top: offset.top
		}, duration);

		return $.when(
			containerPromise,
			framePromise
		);
	},

	showFrame: function(frame) {
		var container = frame.getContainer();
		var containerSize = container.getSize();
		var offset = frame.getPreferredOffset(containerSize);

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

	hideFrame: function(frame) {
		return Util.Deferred.emptyPromise();
	},

	resizeFrame: function(frame) {
		var container = frame.getContainer();
		var containerSize = container.getSize();
		var offset = frame.getPreferredOffset(containerSize);

		return Animation.Default.animateFrame_(
			frame,
			containerSize,
			offset,
			300
		);
	},

	showContent: function(content) {
		return content.getElement().fadeIn(200).promise();
	},

	hideContent: function(content) {
		return content.getElement().fadeOut(300).promise();
	}
};

