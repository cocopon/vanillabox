/**
 * @license Vanillabox
 * (C) 2013 cocopon.
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	var $window = $(window);


	/**
	 * @namespace
	 * @alias Util
	 */
	var Util = {
		/**
		 * @constant
		 * @type {Function}
		 */
		EMPTY_FN: function() {},

		/**
		 * @constant
		 * @type {String}
		 */
		ROOT_CSS: 'vnbx',

		/**
		 * @constant
		 * @type {String}
		 */
		CSS_PREFIX: 'vnbx-',

		/**
		 * @param {*} value
		 * @return {Boolean} true if the value is defined
		 */
		isDefined: function(value) {
			return value !== undefined;
		},

		/**
		 * @param {*} value
		 * @param {*} defaultValue
		 * @return {*}
		 */
		getOrDefault: function(value, defaultValue) {
			return Util.isDefined(value) ?
				value :
				defaultValue;
		},

		/**
		 * @param {Function} Child
		 * @param {Function} Parent
		 */
		inherits: function(Child, Parent) {
			var Tmp = function() {};
			Tmp.prototype = Parent.prototype;

			Child.prototype = new Tmp();
			Child.prototype.constructor = Child;
		}
	};

	Util.Array = {
		forEach: function(array, fn, opt_scope) {
			var scope = opt_scope || this;
			var len = array.length;
			var i;

			for (i = 0; i < len; i++) {
				fn.call(scope, array[i], i);
			}
		},

		map: function(array, fn, opt_scope) {
			var scope = opt_scope || this;
			var result = [];
			var len = array.length;
			var i;

			for (i = 0; i < len; i++) {
				result.push(fn.call(scope, array[i], i));
			}

			return result;
		}
	};

	Util.Deferred = {
		emptyPromise: function() {
			var d = new $.Deferred();

			setTimeout(function() {
				d.resolve();
			}, 0);

			return d.promise();
		}
	};

	Util.Dom = {
		getViewportWidth: function() {
			return window.innerWidth ||
				document.documentElement.clientWidth;
		},

		getViewportHeight: function() {
			return window.innerHeight ||
				document.documentElement.clientHeight;
		}
	};

	Util.Browser = {
		isIos: function() {
			var ua = navigator.userAgent;
			return !!ua.match(/(ipod|iphone|ipad)/ig);
		}
	};


	/**
	 * @alias Events
	 */
	var Events = {
		CHANGE: 'vanilla-change',
		CLICK: 'vanilla-click',
		COMPLETE: 'vanilla-complete'
	};


	/**
	 * @constructor
	 * @alias VanillaException
	 */
	var VanillaException = function(type) {
		var me = this;

		me.type_ = type;
	};

	VanillaException.Types = {
		INVALID_TYPE: 'invalid_type',
		NO_IMAGE: 'no_image'
	};

	VanillaException.prototype.getType = function() {
		return this.type_;
	};


	/**
	 * @alias Animation
	 */
	var Animation = {};

	Animation.None = {
		showMask: function(mask) {
			return mask.getElement().show();
		},

		hideMask: function(mask) {
			return mask.getElement().hide();
		},

		showFrame: function(frame) {
			Animation.None.resizeFrame(frame);
			return frame.getElement().show();
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
			return content.getElement().show();
		},

		hideContent: function(content) {
			return content.getElement().hide();
		}
	};

	Animation.Default = {
		showMask: function(mask) {
			return mask.getElement().fadeIn(200);
		},

		hideMask: function(mask) {
			return mask.getElement().fadeOut(300);
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
			return content.getElement().fadeIn(200);
		},

		hideContent: function(content) {
			return content.getElement().fadeOut(300);
		}
	};


	/**
	 * @alias Animationprovider
	 */
	var AnimationProvider = {
		ANIMATIONS_: {
			'none': Animation.None,
			'default': Animation.Default
		},

		get: function(id) {
			var animation = AnimationProvider.ANIMATIONS_[id];
			return animation || AnimationProvider.getDefault();
		},
		
		getDefault: function() {
			return Animation.Default;
		}
	};


	/**
	 * @constructor
	 * @alias Mask
	 */
	var Mask = function() {
		this.create();
	};

	Mask.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		var $elem = $('<div>');
		$elem.addClass(Util.CSS_PREFIX + 'mask');

		me.elem_ = $elem;
		me.attach_();
	};

	Mask.prototype.release = function() {
		var me = this;

		me.detach_();
		me.elem_ = null;
	};

	Mask.prototype.attach_ = function() {
		var me = this;

		$window.on('resize', $.proxy(me.onWindowResize_, me));

		var elem = me.getElement();
		elem.on('click', $.proxy(me.onClick_, me));
	};

	Mask.prototype.detach_ = function() {
		var me = this;

		$window.off('resize', me.onWindowResize_);

		var elem = me.getElement();
		elem.off('click', me.onClick_);
	};

	Mask.prototype.getElement = function() {
		return this.elem_;
	};

	Mask.prototype.layout = function() {
		var me = this;
		var elem = me.getElement();

		elem.width('');
		elem.height('');

		var $document = $(document);
		var w = Math.max($document.width(), $window.width());
		var h = Math.max($document.height(), $window.height());

		elem.width(w);
		elem.height(h);
	};

	Mask.prototype.onWindowResize_ = function(e) {
		this.layout();
	};

	Mask.prototype.onClick_ = function() {
		var me = this;

		$(me).trigger(Events.CLICK);
	};


	/**
	 * @constructor
	 * @alias Container
	 */
	var Container = function(opt_config) {
		var me = this;
		var config = opt_config || {};

		me.animation_ = Util.getOrDefault(config.animation, AnimationProvider.getDefault());

		me.create();
	};

	Container.CONTENT_SIZE_SAFETY_MARGIN = 100;
	Container.MIN_WIDTH = 200;
	Container.MIN_HEIGHT = 150;

	Container.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		var elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'container');
		me.elem_ = elem;

		me.attach_();
	};

	Container.prototype.release = function() {
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


	/**
	 * @constructor
	 * @alias Frame
	 */
	var Frame = function(opt_config) {
		var me = this;
		var config = opt_config || {};

		var container = new Container({
			animation: config.animation
		});
		me.container_ = container;

		me.create();
		me.attach_();
	};

	Frame.RESIZE_TIMEOUT_DELAY = 500;

	Frame.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		var elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'frame');
		me.elem_ = elem;

		var container = me.container_;
		me.elem_.append(container.getElement());
	};

	Frame.prototype.release = function() {
		var me = this;

		me.container_.release();
		me.container_ = null;

		me.detach_();
		me.elem_ = null;
	};

	Frame.prototype.attach_ = function() {
		var me = this;
		me.elem_.on('click', $.proxy(me.onClick_, me));
	};

	Frame.prototype.detach_ = function() {
		var me = this;
		me.elem_.off('click', me.onClick_);
	};

	Frame.prototype.getElement = function() {
		return this.elem_;
	};

	Frame.prototype.getContainer = function() {
		return this.container_;
	};

	Frame.prototype.getPreferredOffset = function(contentSize) {
		var me = this;
		var container = me.getContainer();
		var containerElem = container.getElement();

		// Save current size
		var w = containerElem.width();
		var h = containerElem.height();

		// Set specified size temporarily
		containerElem.width(contentSize.width);
		containerElem.height(contentSize.height);

		// Get preferred position
		var elem = me.getElement();
		var ow = Util.Dom.getViewportWidth();
		var oh = Util.Dom.getViewportHeight();
		var left = Math.round($window.scrollLeft() + (ow - elem.outerWidth()) / 2);
		var top = Math.round($window.scrollTop() + (oh - elem.outerHeight()) / 2);

		// Restore original size
		containerElem.width(w);
		containerElem.height(h);

		return {
			left: left,
			top: top
		};
	};

	Frame.prototype.onClick_ = function(e) {
		e.stopPropagation();
	};


	/**
	 * @constructor
	 * @alias Content
	 */
	var Content = function(opt_config) {
		var me = this;
		var config = opt_config || {};

		me.loaded_ = false;
		me.success_ = false;

		me.path_ = config.path;
		me.title_ = Util.getOrDefault(config.title, '');

		me.create();
	};

	Content.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		var elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'content');
		me.elem_ = elem;

		me.createInternal_();
		me.attach_();
	};

	Content.prototype.createInternal_ = Util.EMPTY_FN;

	Content.prototype.attach_ = Util.EMPTY_FN;

	Content.prototype.detach_ = Util.EMPTY_FN;

	Content.prototype.release = function() {
		var me = this;

		me.detach_();
		me.elem_ = null;
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
	 * @alias EmptyContent
	 * @extends Content
	 */
	var EmptyContent = function(opt_config) {
		Content.call(this, opt_config);
	};
	Util.inherits(EmptyContent, Content);

	EmptyContent.prototype.create = function() {
		var me = this;

		Content.prototype.create.call(me);

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
	 * @alias ImageContent
	 * @extends Content
	 */
	var ImageContent = function(opt_config) {
		Content.call(this, opt_config);
	};
	Util.inherits(ImageContent, Content);

	ImageContent.prototype.createInternal_ = function() {
		var me = this;

		var imgElem = $('<img>');
		me.elem_.append(imgElem);
		me.imgElem_ = imgElem;
	};

	ImageContent.prototype.release = function() {
		var me = this;

		Content.prototype.release.call(me);

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

	ImageContent.prototype.onLoad_ = function(e) {
		this.onComplete_(true);
	};

	ImageContent.prototype.onError_ = function(e) {
		this.onComplete_(false);
	};


	/**
	 * @constructor
	 * @alias IframeContent
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

	IframeContent.prototype.createInternal_ = function() {
		var me = this;

		var iframeElem = $('<iframe>');
		iframeElem.attr('frameborder', 0);  // Need to disable border in IE
		me.elem_.append(iframeElem);
		me.iframeElem_ = iframeElem;
	};

	IframeContent.prototype.release = function() {
		var me = this;

		Content.prototype.release.call(me);

		me.iframeElem_ = null;
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

	IframeContent.prototype.onLoad_ = function(e) {
		var me = this;
		var iframeElem = me.iframeElem_;

		if (!iframeElem.attr('src')) {
			// Ignore unwanted load event that is fired when appending to DOM
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


	/**
	 * @alias ContentFactory
	 */
	var ContentFactory = {
		FACTORIES_: {
			'image': function(target, options) {
				return new ImageContent({
					path: target.attr('href'),
					title: target.attr('title')
				});
			},
			'iframe': function(target, options) {
				return new IframeContent({
					path: target.attr('href'),
					preferredWidth: options.preferredWidth,
					preferredHeight: options.preferredHeight,
					title: target.attr('title')
				});
			}
		},

		create: function(target, options) {
			var factoryFn = ContentFactory.FACTORIES_[options.type];

			if (!factoryFn) {
				throw new VanillaException(VanillaException.Types.INVALID_TYPE);
			}

			return factoryFn(target, options);
		}
	};


	/**
	 * The pager class manages a current page.
	 * @constructor
	 * @alias Pager
	 */
	var Pager = function(opt_config) {
		var me = this;
		var config = opt_config || {};

		me.totalPages_ = Util.getOrDefault(config.totalPages, 1);
		me.allowsLoop_ = Util.getOrDefault(config.loop, false);

		me.setPage(Util.getOrDefault(config.page, 0));
	};

	/**
	 * @return {Number} Current page of the pager.
	 */
	Pager.prototype.getPage = function() {
		return this.currentPage_;
	};

	/**
	 * @param {Number} page Current page of the pager.
	 */
	Pager.prototype.setPage = function(page) {
		var me = this;
		var currentIndex = me.currentPage_;
		var totalPages = me.getTotalPages();
		var newIndex = Math.min(Math.max(page, 0), totalPages - 1);

		me.currentPage_ = newIndex;

		if (currentIndex !== newIndex) {
			$(me).trigger(Events.CHANGE);
		}
	};

	/**
	 * @return {Number} Total number of pages of the pager.
	 */
	Pager.prototype.getTotalPages = function() {
		return this.totalPages_;
	};

	/**
	 * @return {Boolean} true if the current page has a previous page
	 */
	Pager.prototype.hasPrevious = function() {
		var me = this;

		if (me.allowsLoop_) {
			return true;
		}

		return me.currentPage_ > 0;
	};

	/**
	 * @return {Boolean} true if the current page has a next page
	 */
	Pager.prototype.hasNext = function() {
		var me = this;

		if (me.allowsLoop_) {
			return true;
		}

		var totalPages = me.getTotalPages();
		return me.currentPage_ < totalPages - 1;
	};

	/**
	 * Sets the current page to the next page.
	 */
	Pager.prototype.next = function() {
		var me = this;
		var totalPages = me.getTotalPages();
		var currentIndex = me.currentPage_;
		var nextIndex = currentIndex + 1;

		if (nextIndex > totalPages - 1) {
			nextIndex = me.allowsLoop_ ?
				0 :
				totalPages - 1;
		}
		me.currentPage_ = nextIndex;

		if (currentIndex !== nextIndex) {
			$(me).trigger(Events.CHANGE);
		}
	};

	/**
	 * Sets the current page to the previous page.
	 */
	Pager.prototype.previous = function() {
		var me = this;
		var totalPages = me.getTotalPages();
		var currentIndex = me.currentPage_;
		var prevIndex = currentIndex - 1;

		if (prevIndex <= 0) {
			prevIndex = me.allowsLoop_ ?
				totalPages - 1 :
				0;
		}
		me.currentPage_ = prevIndex;

		if (currentIndex !== prevIndex) {
			$(me).trigger(Events.CHANGE);
		}
	};


	/**
	 * @constructor
	 * @alias Button
	 */
	var Button = function(config) {
		var me = this;

		me.cls_ = config.cls;
		me.disabled_ = Util.getOrDefault(config.disabled, false);

		me.create();
	};

	Button.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		var elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'button');
		if (me.cls_) {
			elem.addClass(me.cls_);
		}

		// Enable :active pseudo-class on touch device
		elem.attr('ontouchstart', 'void(0)');

		me.elem_ = elem;

		me.attach_();
	};

	Button.prototype.release = function() {
		var me = this;

		me.elem_ = null;
	};

	Button.prototype.attach_ = function() {
		var me = this;
		var elem = me.getElement();

		elem.on('click', $.proxy(me.onClick_, me));
	};

	Button.prototype.detach_ = function() {
		var me = this;
		var elem = me.getElement();

		elem.off('click', me.onClick_);
	};

	Button.prototype.getElement = function() {
		return this.elem_;
	};

	Button.prototype.isDisabled = function() {
		return this.disabled_;
	};

	Button.prototype.setDisabled = function(disabled) {
		var me = this;
		var elem = me.elem_;

		me.disabled_ = disabled;

		if (me.disabled_) {
			elem.addClass(Util.CSS_PREFIX + 'disabled');
		}
		else {
			elem.removeClass(Util.CSS_PREFIX + 'disabled');
		}
	};

	Button.prototype.onClick_ = function(e) {
		var me = this;

		e.stopPropagation();

		if (!me.isDisabled()) {
			$(me).trigger(Events.CLICK);
		}
	};


	/**
	 * @constructor
	 * @alias Label
	 */
	var Label = function(config) {
		var me = this;

		me.cls_ = config.cls;

		me.create();
	};

	Label.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		var elem = $('<div>');
		elem.addClass(Util.CSS_PREFIX + 'label');
		if (me.cls_) {
			elem.addClass(me.cls_);
		}
		me.elem_ = elem;
	};

	Label.prototype.release = function() {
		var me = this;

		me.elem_ = null;
	};

	Label.prototype.getElement = function() {
		return this.elem_;
	};

	Label.prototype.getText = function() {
		return this.elem_.text();
	};

	Label.prototype.setText = function(text) {
		this.elem_.text(text);
	};


	/**
	 * @constructor
	 * @alias Vanillabox
	 */
	var Vanillabox = function(config) {
		var me = this;

		if (!config.targets || config.targets.length === 0) {
			throw new VanillaException(VanillaException.Types.NO_IMAGE);
		}

		me.showed_ = false;

		me.targetElems_ = config.targets;
		me.animation_ = Util.getOrDefault(
			config.animation,
			AnimationProvider.getDefault()
		);
		me.repositionOnScroll_ = config.repositionOnScroll;
		me.supportsKeyboard_ = config.keyboard;
		me.closeButtonEnabled_ = config.closeButton;

		me.contentOptions_ = {
			preferredWidth: config.preferredWidth,
			preferredHeight: config.preferredHeight,
			type: config.type
		};

		me.pager_ = new Pager({
			loop: config.loop,
			totalPages: me.targetElems_.length
		});

		me.create();
	};

	Vanillabox.DELAYED_LAYOUT_DELAY = 300;

	Vanillabox.prototype.create = function() {
		var me = this;

		if (me.created_) {
			return;
		}
		me.created_ = true;

		var mask = new Mask();
		var maskElem = mask.getElement();
		maskElem.addClass(Util.ROOT_CSS);
		maskElem.hide();
		$('body').append(maskElem);
		me.mask_ = mask;

		me.setupRootCss_();

		var frame = new Frame({
			animation: me.animation_
		});
		var frameElem = frame.getElement();
		me.frame_ = frame;
		maskElem.append(frameElem);

		var titleLabel = new Label({
			cls: Util.CSS_PREFIX + 'title'
		});
		me.titleLabel_ = titleLabel;
		frameElem.append(titleLabel.getElement());

		var pagerLabel = new Label({
			cls: Util.CSS_PREFIX + 'pager'
		});
		me.pagerLabel_ = pagerLabel;
		frameElem.append(pagerLabel.getElement());

		var prevButton = new Button({
			cls: Util.CSS_PREFIX + 'prev'
		});
		me.prevButton_ = prevButton;
		frameElem.append(prevButton.getElement());

		var nextButton = new Button({
			cls: Util.CSS_PREFIX + 'next'
		});
		me.nextButton_ = nextButton;
		frameElem.append(nextButton.getElement());

		var closeButton = new Button({
			cls: Util.CSS_PREFIX + 'close'
		});
		if (!me.closeButtonEnabled_) {
			closeButton.getElement().hide();
		}
		me.closeButton_ = closeButton;
		frameElem.append(closeButton.getElement());

		me.attach_();

		var contents = Util.Array.map(me.targetElems_, function(target) {
			var targetElem = $(target);
			return ContentFactory.create(targetElem, me.contentOptions_);
		});
		me.contents_ = contents;

		var emptyContent = new EmptyContent();
		me.setContent_(emptyContent);
	};

	Vanillabox.prototype.setupRootCss_ = function() {
		var me = this;
		var rootElem = me.mask_.getElement();

		if (Util.Browser.isIos()) {
			rootElem.addClass(Util.CSS_PREFIX + 'ios');
		}
		if (me.closeButtonEnabled_) {
			rootElem.addClass(Util.CSS_PREFIX + 'close-button-enabled');
		}
		if (me.pager_.getTotalPages() > 1) {
			rootElem.addClass(Util.CSS_PREFIX + 'group');
		}
	};

	Vanillabox.prototype.release = function() {
		var me = this;

		me.detachWindow_();
		me.detach_();

		Util.Array.forEach(me.contents_, function(content) {
			content.release();
		});
		me.contents_ = null;

		me.titleLabel_.release();
		me.titleLabel_ = null;

		me.pagerLabel_.release();
		me.pagerLabel_ = null;

		me.closeButton_.release();
		me.closeButton_ = null;

		me.prevButton_.release();
		me.prevButton_ = null;

		me.nextButton_.release();
		me.nextButton_ = null;

		me.frame_.release();
		me.frame_ = null;

		me.mask_.getElement().remove();
		me.mask_.release();
		me.mask_ = null;

		me.created_ = false;
	};

	Vanillabox.prototype.attach_ = function() {
		var me = this;

		me.targetElems_.on('click', $.proxy(me.onTargetElementClick_, me));

		$(me.mask_).on(Events.CLICK, $.proxy(me.onMaskClick_, me));

		var $pager = $(me.pager_);
		$pager.on(Events.CHANGE, $.proxy(me.onPagerChange_, me));

		$(me.closeButton_).on(Events.CLICK, $.proxy(me.onCloseButtonClick_, me));
		$(me.prevButton_).on(Events.CLICK, $.proxy(me.onPreviousButtonClick_, me));
		$(me.nextButton_).on(Events.CLICK, $.proxy(me.onNextButtonClick_, me));
	};

	Vanillabox.prototype.detach_ = function() {
		var me = this;

		me.targetElems_.off('click', me.onTargetElementClick_);

		$(me.mask_).off(Events.CLICK, me.onMaskClick_);

		var $pager = $(me.pager_);
		$pager.off(Events.CHANGE, me.onPagerChange_);

		$(me.closeButton_).off(Events.CLICK, me.onCloseButtonClick_);
		$(me.prevButton_).off(Events.CLICK, me.onPreviousButtonClick_);
		$(me.nextButton_).off(Events.CLICK, me.onNextButtonClick_);

		me.detachContent_();
		me.content_ = null;
	};

	Vanillabox.prototype.attachWindow_ = function() {
		var me = this;
		var $document = $(document);

		$window.on('resize', $.proxy(me.onWindowResize_, me));
		$window.on('scroll', $.proxy(me.onWindowScroll_, me));
		$document.on('keyup', $.proxy(me.onDocumentKeyUp_, me));
	};

	Vanillabox.prototype.detachWindow_ = function() {
		var me = this;
		var $document = $(document);

		$window.off('resize', me.onWindowResize_, me);
		$window.off('scroll', me.onWindowScroll_, me);
		$document.off('keyup', me.onDocumentKeyUp_, me);
	};

	Vanillabox.prototype.attachContent_ = function() {
		var me = this;
		var content = me.getContent_();
		var contentElem = content.getElement();

		$(content).on(Events.COMPLETE, $.proxy(me.onContentComplete_, me));
		contentElem.on('click', $.proxy(me.onContentClick_, me));
	};

	Vanillabox.prototype.detachContent_ = function() {
		var me = this;
		var content = me.getContent_();
		var contentElem = content.getElement();

		$(content).off('complete', me.onContentComplete_);
		contentElem.off('click', me.onContentClick_);
	};

	/**
	 * @param {Number} opt_index
	 */
	Vanillabox.prototype.show = function(opt_index) {
		var me = this;
		var animation = me.animation_;

		if (me.showed_) {
			return Util.Deferred.emptyPromise();
		}
		me.showed_ = true;

		me.attachWindow_();

		var container = me.frame_.getContainer();
		container.updateMaxContentSize_();

		var mask = me.mask_;
		mask.layout();
		var maskPromise = animation.showMask(mask);

		var framePromise = animation.showFrame(me.frame_);

		var pager = me.pager_;
		var index = Util.getOrDefault(opt_index, 0);
		var triggeredPagerEvent = (index !== pager.getPage());
		pager.setPage(index);
		if (!triggeredPagerEvent) {
			me.updateContent_();
		}

		return $.when(
			maskPromise,
			framePromise
		);
	};

	/**
	 * @return {undefined}
	 */
	Vanillabox.prototype.hide = function() {
		var me = this;

		if (!me.showed_) {
			return Util.Deferred.emptyPromise();
		}

		return $.when(
			me.animation_.hideFrame(me.frame_),
			me.animation_.hideMask(me.mask_)
		).done(function() {
			me.detachWindow_();
			me.showed_ = false;
		});
	};

	Vanillabox.prototype.setTitle = function(title) {
		var me = this;
		var titleLabel = me.titleLabel_;

		titleLabel.setText(title);
	};

	Vanillabox.prototype.previous = function() {
		this.pager_.previous();
	};

	Vanillabox.prototype.next = function() {
		this.pager_.next();
	};

	Vanillabox.prototype.getContent_ = function() {
		var me = this;
		var container = me.frame_.getContainer();

		return container.getContent();
	};

	Vanillabox.prototype.setContent_ = function(content) {
		var me = this;
		var container = me.frame_.getContainer();

		var prevContent = me.getContent_();
		if (prevContent === content) {
			container.layout();
			return;
		}

		if (prevContent) {
			me.detachContent_();
		}

		container.setContent(content);
		me.attachContent_();
		me.setTitle(content.getTitle());

		content.load();
		container.layout();
	};

	Vanillabox.prototype.layout = function(forceLayout) {
		var me = this;
		var needsResizing = (forceLayout || me.repositionOnScroll_);

		if (needsResizing) {
			me.animation_.resizeFrame(me.frame_);
		}
	};

	Vanillabox.prototype.updatePager_ = function() {
		var me = this;
		var pager = me.pager_;

		var page = pager.getPage();
		var totalPages = pager.getTotalPages();
		var text =
			String(page + 1) +
			' of ' +
			String(totalPages);

		var label = me.pagerLabel_;
		label.setText(text);

		me.prevButton_.setDisabled(!pager.hasPrevious());
		me.nextButton_.setDisabled(!pager.hasNext());
	};

	Vanillabox.prototype.updateContent_ = function() {
		var me = this;

		me.updatePager_();

		var index = me.pager_.getPage();
		var content = me.contents_[index];
		me.setContent_(content);
	};

	Vanillabox.prototype.delayedLayout_ = function(forceLayout) {
		var me = this;

		if (me.layoutTimeout_) {
			clearTimeout(me.layoutTimeout_);
		}

		me.layoutTimeout_ = setTimeout(function() {
			me.layout(forceLayout);
		}, Vanillabox.DELAYED_LAYOUT_DELAY);
	};

	Vanillabox.prototype.onWindowResize_ = function() {
		this.delayedLayout_(false);
	};

	Vanillabox.prototype.onWindowScroll_ = function() {
		this.delayedLayout_(false);
	};

	Vanillabox.prototype.onDocumentKeyUp_ = function(e) {
		var me = this;

		if (!me.supportsKeyboard_) {
			return;
		}

		switch (e.keyCode) {
			case 27:  // Escape
				me.hide();
				break;
			case 37:  // Left
				me.previous();
				break;
			case 39:  // Right
				me.next();
				break;
		}
	};

	Vanillabox.prototype.onTargetElementClick_ = function(e) {
		var me = this;
		var index = me.targetElems_.index(e.target);

		if (index < 0) {
			return;
		}

		e.preventDefault();

		me.show(index);
	};

	Vanillabox.prototype.onPagerChange_ = function() {
		this.updateContent_();
	};

	Vanillabox.prototype.onMaskClick_ = function() {
		var me = this;

		if (!me.closeButtonEnabled_) {
			me.hide();
		}
	};

	Vanillabox.prototype.onCloseButtonClick_ = function() {
		var me = this;

		if (!me.closeButtonEnabled_) {
			return;
		}

		me.hide();
	};

	Vanillabox.prototype.onPreviousButtonClick_ = function() {
		this.previous();
	};

	Vanillabox.prototype.onNextButtonClick_ = function() {
		this.next();
	};

	Vanillabox.prototype.onContentComplete_ = function(e, success) {
		this.layout(true);
	};

	Vanillabox.prototype.onContentClick_ = function(e) {
		var me = this;
		var pager = me.pager_;

		e.stopPropagation();

		if (!pager.hasNext()) {
			me.hide();
			return;
		}

		me.next();
	};


	var DEFAULT_CONFIG = {
		'animation': 'default',
		'closeButton': false,
		'keyboard': true,
		'loop': false,
		'preferredHeight': 600,
		'preferredWidth': 800,
		'repositionOnScroll': false,
		'type': 'image'
	};


	$.fn.vanillabox = function(opt_config) {
		var config = {};
		$.extend(config, DEFAULT_CONFIG);
		$.extend(config, opt_config);

		var targetElems = $(this);
		var animation = AnimationProvider.get(config['animation']);

		var box = new Vanillabox({
			animation: animation,
			closeButton: config['closeButton'],
			keyboard: config['keyboard'],
			loop: config['loop'],
			preferredHeight: config['preferredHeight'],
			preferredWidth: config['preferredWidth'],
			repositionOnScroll: config['repositionOnScroll'],
			targets: targetElems,
			type: config['type']
		});

		return box;
	};

	// For testing of private classes
	// TODO: Better solution?
	$.fn.vanillabox.privateClasses_ = {
		'Events': Events,
		'DEFAULT_CONFIG': DEFAULT_CONFIG,
		'Pager': Pager,
		'Vanillabox': Vanillabox,
		'VanillaException': VanillaException
	};
})(jQuery);
