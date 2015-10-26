const Events = require('./events.js');
const Util = require('./util.js');

/**
 * @constructor
 */
var Content = function(opt_config) {
	var me = this;
	var config = opt_config || {};

	me.loaded_ = false;
	me.success_ = false;

	me.path_ = config.path;
	me.title_ = Util.getOrDefault(config.title, '');

	me.setup_();
};

Content.prototype.setup_ = function() {
	var me = this;

	var elem = $('<div>');
	elem.addClass(Util.CSS_PREFIX + 'content');
	me.elem_ = elem;

	me.setupInternal_();
	me.attach_();
};

Content.prototype.setupInternal_ = Util.EMPTY_FN;

Content.prototype.attach_ = Util.EMPTY_FN;

Content.prototype.detach_ = Util.EMPTY_FN;

Content.prototype.dispose = function() {
	var me = this;

	me.detach_();
	me.elem_.remove();
	me.elem_ = null;
};

Content.prototype.shouldUnloadOnHide = function() {
	return false;
};

Content.prototype.isLoaded = function() {
	return this.loaded_;
};

Content.prototype.getElement = function() {
	return this.elem_;
};

Content.prototype.getTitle = function() {
	return this.title_;
};

Content.prototype.getSize = function() {
	var me = this;
	var elem = me.getElement();

	return {
		width: elem.width(),
		height: elem.height()
	};
};

Content.prototype.setOffset = function(left, top) {
	var me = this;
	var elem = me.getElement();

	elem.css({
		marginLeft: left,
		marginTop: top
	});
};

Content.prototype.setMaxContentSize = function(width, height) {
	this.getElement().css({
		maxWidth: width,
		maxHeight: height
	});
};

Content.prototype.load = function() {
	var me = this;
	var elem = me.getElement();

	elem.addClass(Util.CSS_PREFIX + 'loading');

	if (me.loaded_) {
		this.onComplete_(me.success_);
		return;
	}

	me.loadInternal_();
};

Content.prototype.loadInternal_ = Util.EMPTY_FN;

Content.prototype.unload = function() {
	var me = this;
	me.unloadInternal_();
	me.loaded_ = false;
};

Content.prototype.unloadInternal_ = Util.EMPTY_FN;

Content.prototype.onComplete_ = function(success) {
	var me = this;
	var elem = me.getElement();

	me.loaded_ = true;
	me.success_ = success;

	elem.removeClass(Util.CSS_PREFIX + 'loading');
	if (!success) {
		elem.addClass(Util.CSS_PREFIX + 'error');
	}

	$(me).trigger(Events.COMPLETE, success);
};

module.exports = Content;
