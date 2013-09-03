/**
 * @constructor
 */
var Container = function(opt_config) {
	var me = this;
	var config = opt_config || {};

	me.animation_ = Util.getOrDefault(config.animation, AnimationProvider.getDefault());

	me.setup_();
};

Container.CONTENT_SIZE_SAFETY_MARGIN = 100;
Container.MIN_WIDTH = 200;
Container.MIN_HEIGHT = 150;

Container.prototype.setup_ = function() {
	var me = this;

	var elem = $('<div>');
	elem.addClass(Util.CSS_PREFIX + 'container');
	me.elem_ = elem;

	me.attach_();
};

Container.prototype.dispose = function() {
	var me = this;

	me.detach_();
	me.elem_ = null;
};

Container.prototype.attach_ = function() {
};

Container.prototype.detach_ = function() {
	this.detachContent_();
};

Container.prototype.attachContent_ = function() {
	var me = this;
	var content = me.getContent();

	$(content).on(Events.COMPLETE, $.proxy(me.onContentComplete_, me));
};

Container.prototype.detachContent_ = function() {
	var me = this;
	var content = me.getContent();

	$(content).off(Events.COMPLETE, me.onContentComplete_);
};

Container.prototype.getElement = function() {
	return this.elem_;
};

Container.prototype.getContent = function() {
	return this.content_;
};

Container.prototype.setContent = function(content) {
	var me = this;
	var animation = me.animation_;

	if (me.content_) {
		me.detachContent_();
		animation.hideContent(me.content_);
	}

	me.content_ = content;

	me.attachContent_();

	if (me.maxContentSize_) {
		me.applyMaxContentSize_();
	}

	var elem = me.getElement();
	var contentElem = me.content_.getElement();
	var contentElems = elem.find('> *');
	if (contentElems.length === 0) {
		elem.append(contentElem);
	}
	else {
		// Insert newer content behind all existing contents
		contentElem.insertBefore(contentElems.first());
	}

	animation.showContent(me.content_);
};

Container.prototype.getSize = function() {
	var me = this;
	var content = me.getContent();

	var contentSize = {
		width: 0,
		height: 0
	};
	if (content) {
		contentSize = content.getSize();
	}

	return {
		width: Math.max(contentSize.width, Container.MIN_WIDTH),
		height: Math.max(contentSize.height, Container.MIN_HEIGHT)
	};
};

Container.prototype.updateMaxContentSize_ = function() {
	var me = this;

	var safetyMargin = Container.CONTENT_SIZE_SAFETY_MARGIN;
	me.maxContentSize_ = {
		width: Util.Dom.getViewportWidth() - safetyMargin,
		height: Util.Dom.getViewportHeight() - safetyMargin
	};

	var content = me.content_;
	if (!content) {
		return;
	}

	me.applyMaxContentSize_();
};

Container.prototype.applyMaxContentSize_ = function() {
	var me = this;
	var content = me.getContent();
	var maxSize = me.maxContentSize_;

	content.setMaxContentSize(
		Math.max(maxSize.width, Container.MIN_WIDTH),
		Math.max(maxSize.height, Container.MIN_HEIGHT)
	);
};

Container.prototype.layout = function() {
	var me = this;
	var content = me.getContent();
	var contentSize = content.getSize();

	content.setOffset(
		-Math.round(contentSize.width / 2),
		-Math.round(contentSize.height / 2)
	);
};

Container.prototype.onContentComplete_ = function(e, success) {
	this.layout();
};

