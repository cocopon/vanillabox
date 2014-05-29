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


/**
 * @constructor
 * @extends Content
 */
var EmptyContent = function(opt_config) {
	Content.call(this, opt_config);
};
Util.inherits(EmptyContent, Content);

EmptyContent.prototype.setup_ = function() {
	var me = this;

	Content.prototype.setup_.call(me);

	me.elem_.addClass(Util.CSS_PREFIX + 'empty');
};

EmptyContent.prototype.load = function() {
	var me = this;

	setTimeout(function() {
		$(me).trigger(Events.COMPLETE, true);
	}, 0);
};


/**
 * @constructor
 * @extends Content
 */
var ImageContent = function(opt_config) {
	Content.call(this, opt_config);
};
Util.inherits(ImageContent, Content);

ImageContent.EMPTY_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

ImageContent.prototype.setupInternal_ = function() {
	var me = this;

	var imgElem = $('<img>');
	me.elem_.append(imgElem);
	me.imgElem_ = imgElem;
};

ImageContent.prototype.dispose = function() {
	var me = this;

	Content.prototype.dispose.call(me);

	me.imgElem_ = null;
};

ImageContent.prototype.attach_ = function() {
	var me = this;
	var imgElem = me.imgElem_;

	imgElem.on('load', $.proxy(me.onLoad_, me));
	imgElem.on('error', $.proxy(me.onError_, me));
};

ImageContent.prototype.detach_ = function() {
	var me = this;
	var imgElem = me.imgElem_;

	imgElem.off('load', me.onLoad_);
	imgElem.off('error', me.onError_);
};

ImageContent.prototype.setMaxContentSize = function(width, height) {
	var me = this;
	var imgElem = me.imgElem_;

	imgElem.css({
		maxWidth: width,
		maxHeight: height
	});
};

ImageContent.prototype.loadInternal_ = function() {
	var me = this;
	me.imgElem_.attr('src', me.path_);
};

ImageContent.prototype.unloadInternal_ = function() {
	this.imgElem_.attr('src', ImageContent.EMPTY_SRC);
};

ImageContent.prototype.onLoad_ = function(e) {
	var me = this;

	if (me.imgElem_.attr('src') === ImageContent.EMPTY_SRC) {
		return;
	}

	this.onComplete_(true);
};

ImageContent.prototype.onError_ = function(e) {
	this.onComplete_(false);
};


/**
 * @constructor
 * @extends Content
 */
var IframeContent = function(opt_config) {
	var me = this;
	var config = opt_config || {};

	me.preferredWidth_ = config.preferredWidth;
	me.preferredHeight_ = config.preferredHeight;

	Content.call(me, config);
};
Util.inherits(IframeContent, Content);

IframeContent.EMPTY_SRC = 'about:blank';

IframeContent.prototype.setupInternal_ = function() {
	var me = this;

	var iframeElem = $('<iframe>');
	iframeElem.attr('frameborder', 0);  // Need to disable border in IE
	me.elem_.append(iframeElem);
	me.iframeElem_ = iframeElem;
};

IframeContent.prototype.dispose = function() {
	var me = this;

	Content.prototype.dispose.call(me);

	me.iframeElem_ = null;
};

IframeContent.prototype.shouldUnloadOnHide = function() {
	return true;
};

IframeContent.prototype.attach_ = function() {
	var me = this;
	var iframeElem = me.iframeElem_;

	iframeElem.on('load', $.proxy(me.onLoad_, me));
	iframeElem.on('error', $.proxy(me.onError_, me));
};

IframeContent.prototype.detach_ = function() {
	var me = this;
	var iframeElem = me.iframeElem_;

	iframeElem.off('load', me.onLoad_);
	iframeElem.off('error', me.onError_);
};

IframeContent.prototype.getFlexibleElement = function() {
	var me = this;

	// In iOS, cannot restrict a size of an iframe element
	// so return an outer element instead
	return Util.Browser.isIos() ?
		me.getElement() :
		me.iframeElem_;
};

IframeContent.prototype.getSize = function() {
	var me = this;
	var elem = me.getFlexibleElement();

	return {
		width: elem.width(),
		height: elem.height()
	};
};

IframeContent.prototype.setMaxContentSize = function(width, height) {
	var me = this;
	var elem = me.getFlexibleElement();

	elem.css({
		maxWidth: width,
		maxHeight: height
	});
};

IframeContent.prototype.loadInternal_ = function() {
	var me = this;
	me.iframeElem_.attr('src', me.path_);
};

IframeContent.prototype.unloadInternal_ = function() {
	var me = this;

	me.iframeElem_.attr('src', IframeContent.EMPTY_SRC);

	var elem = me.getFlexibleElement();
	elem.width('');
	elem.height('');
};

IframeContent.prototype.onLoad_ = function(e) {
	var me = this;
	var iframeElem = me.iframeElem_;

	var src = iframeElem.attr('src');
	if (!src) {
		// Ignore unwanted load event that is fired when appending to DOM
		return;
	}
	if (src === IframeContent.EMPTY_SRC) {
		return;
	}

	var elem = me.getFlexibleElement();
	elem.width(me.preferredWidth_);
	elem.height(me.preferredHeight_);

	me.onComplete_(true);
};

IframeContent.prototype.onError_ = function(e) {
	this.onComplete_(false);
};

