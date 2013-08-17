/**
 * @license Vanillabox: Simple, modern Lightbox-like plugin for jQuery
 * (C) 2013 cocopon.
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
	var defaults = {
	};
	var $window = $(window);


	var Util = {
		isDefined: function(value) {
			return value !== undefined;
		},

		getOrDefault: function(value, defaultValue) {
			return Util.isDefined(value) ?
				value :
				defaultValue;
		}
	};


	var Animation = {};

	Animation.None = {
		showMask: function(elem) {
			elem.show();
		},

		hideMask: function(elem) {
			elem.hide();
		},

		showFrame: function(elem, rect) {
			elem.show();
		},

		hideFrame: function(elem) {
			elem.hide();
		},

		resizeFrame: function(elem, rect) {
			elem.css({
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height
			});
		}
	};

	Animation.Default = {
		showMask: function(elem) {
			elem.fadeIn(200);
		},

		hideMask: function(elem) {
			elem.fadeOut(300);
		},

		getRect_: function(elem) {
			return {
				left: parseFloat(elem.css('left')),
				top: parseFloat(elem.css('top')),
				width: elem.width(),
				height: elem.height()
			};
		},

		scaleRect_: function(rect, scale) {
			var result = {
				width: rect.width * scale,
				height: rect.height * scale
			};

			result.left = rect.left + (rect.width - result.width) / 2;
			result.top = rect.top + (rect.height - result.height) / 2;

			return result;
		},

		showFrame: function(elem, rect) {
			var startRect = Animation.Default.scaleRect_(rect, 0.8);

			elem.css({
				left: startRect.left,
				top: startRect.top,
				width: startRect.width,
				height: startRect.height
			});
			elem.animate({
				opacity: 1.0,
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height
			}, {
				duration: 300
			});
		},

		hideFrame: function(elem) {
			var rect = Animation.Default.getRect_(elem);
			var endRect = Animation.Default.scaleRect_(rect, 0.8);

			elem.animate({
				opacity: 0,
				left: endRect.left,
				top: endRect.top,
				width: endRect.width,
				height: endRect.height
			}, {
				duration: 300
			});
		},

		resizeFrame: function(elem, rect) {
			elem.animate({
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height
			}, {
				duration: 200
			});
		}
	};

	var AnimationProvider = {
		ANIMATIONS_: {
			'none': Animation.None,
			'default': Animation.Default
		},

		get: function(id) {
			var animation = AnimationProvider.ANIMATIONS_[id];
			return animation || Animation.Default;
		}
	};


	var Mask = function() {
		this.create();
	};

	Mask.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		var $elem = $('<div>');
		$elem.addClass('vanilla-mask');

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
	};

	Mask.prototype.detach_ = function() {
		$window.off('resize', this.onWindowResize_);
	};

	Mask.prototype.getElement = function() {
		return this.elem_;
	};

	Mask.prototype.layout = function() {
		var me = this;
		var $document = $(document);
		var ww = Math.max($document.width(), $window.width());
		var wh = Math.max($document.height(), $window.height());

		me.elem_.width(ww);
		me.elem_.height(wh);
	};

	Mask.prototype.onWindowResize_ = function(e) {
		this.layout();
	};


	var Frame = function(config) {
		var me = this;

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
		elem.addClass('vanilla-frame');
		me.elem_ = elem;
	};

	Frame.prototype.release = function() {
		var me = this;

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

	Frame.prototype.getPreferredRect = function() {
		var me = this;
		var elem = me.elem_;

		// Save current size
		var width = elem.width();
		var height = elem.height();

		// Remove size constraints
		elem.width('');
		elem.height('');

		// Get default size
		var w = elem.width();
		var h = elem.height();
		var ow = window.innerWidth;
		var oh = window.innerHeight;
		var left = $window.scrollLeft() + (ow - elem.outerWidth()) / 2;
		var top = $window.scrollTop() + (oh - elem.outerHeight()) / 2;

		// Restore size
		elem.width(width);
		elem.height(height);

		return {
			left: left,
			top: top,
			width: w,
			height: h
		};
	};

	Frame.prototype.onClick_ = function(e) {
		e.stopPropagation();
	};


	var Container = function(config) {
		var me = this;

		me.create();
	};

	Container.CONTENT_SIZE_SAFETY_MARGIN = 100;

	Container.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		var elem = $('<div>');
		elem.addClass('vanilla-container');
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
	};

	Container.prototype.getElement = function() {
		return this.elem_;
	};

	Container.prototype.getContent = function() {
		return this.content_;
	};

	Container.prototype.setContent = function(content) {
		var me = this;

		if (me.content_) {
			me.content_.getElement().remove();
			me.content_.release();
		}

		me.content_ = content;

		var contentElem = me.content_.getElement();
		if (me.maxContentSize_) {
			contentElem.css({
				maxWidth: me.maxContentSize_.width,
				maxHeight: me.maxContentSize_.height
			});
		}
		me.elem_.append(contentElem);
	};

	Container.prototype.updateMaxContentSize = function() {
		var me = this;
		var contentElem = me.content_.getElement();
		var safetyMargin = Container.CONTENT_SIZE_SAFETY_MARGIN;

		me.maxContentSize_ = {
			width: window.innerWidth - safetyMargin,
			height: window.innerHeight - safetyMargin
		};

		contentElem.css({
			maxWidth: me.maxContentSize_.width,
			maxHeight: me.maxContentSize_.height
		});
	};


	var ImageContent = function(config) {
		var me = this;

		me.path_ = config.path;
		me.title_ = config.title;

		me.create();
		me.load();
	};

	ImageContent.prototype.create = function() {
		var me = this;

		if (me.elem_) {
			return;
		}

		// Element
		var elem = $('<img>');
		elem.addClass('vanilla-content');
		me.elem_ = elem;

		me.attach_();
	};

	ImageContent.prototype.release = function() {
		var me = this;

		me.detach_();
		me.elem_ = null;
	};

	ImageContent.prototype.attach_ = function() {
		var me = this;
		var elem = me.getElement();

		elem.on('load', $.proxy(me.onLoad_, me));
		elem.on('error', $.proxy(me.onError_, me));
	};

	ImageContent.prototype.detach_ = function() {
		var me = this;
		var elem = me.getElement();

		elem.off('load', me.onLoad_);
		elem.off('error', me.onError_);
	};

	ImageContent.prototype.getElement = function() {
		return this.elem_;
	};

	ImageContent.prototype.getTitle = function() {
		return this.title_;
	};

	ImageContent.prototype.load = function() {
		var me = this;
		var elem = me.getElement();

		elem.addClass('vanilla-loading');
		elem.attr({
			src: me.path_
		});
	};

	ImageContent.prototype.onLoad_ = function(e) {
		this.onComplete_(true, e);
	};

	ImageContent.prototype.onError_ = function(e) {
		this.onComplete_(false, e);
	};

	ImageContent.prototype.onComplete_ = function(success, e) {
		var me = this;
		var elem = me.getElement();

		elem.removeClass('vanilla-loading');
		if (!success) {
			elem.addClass('vanilla-error');
		}

		$(me).trigger('complete');
	};


	var Pager = function(config) {
		var me = this;

		me.totalPages_ = config.totalPages;
		me.currentPage_ = Util.getOrDefault(config.page, 0);
		me.allowsLoop_ = Util.getOrDefault(config.allowsLoop, false);
	};

	Pager.prototype.getCurrentPage = function() {
		return this.currentPage_;
	};

	Pager.prototype.setCurrentPage = function(page) {
		var me = this;
		var currentIndex = me.currentPage_;
		var totalPages = me.getTotalPages();
		var newIndex = Math.min(Math.max(page, 0), totalPages - 1);

		me.currentPage_ = newIndex;

		if (currentIndex !== newIndex) {
			$(me).trigger('change');
		}
	};

	Pager.prototype.getTotalPages = function() {
		return this.totalPages_;
	};

	Pager.prototype.hasPrevious = function() {
		var me = this;

		if (me.allowsLoop_) {
			return true;
		}

		return me.currentPage_ > 0;
	};

	Pager.prototype.hasNext = function() {
		var me = this;

		if (me.allowsLoop_) {
			return true;
		}

		var totalPages = me.getTotalPages();
		return me.currentPage_ < totalPages - 1;
	};

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
			$(me).trigger('change');
		}
	};

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
			$(me).trigger('change');
		}
	};


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
		elem.addClass('vanilla-button');
		if (me.cls_) {
			elem.addClass(me.cls_);
		}
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
			elem.addClass('vanilla-disabled');
		}
		else {
			elem.removeClass('vanilla-disabled');
		}
	};

	Button.prototype.onClick_ = function(e) {
		var me = this;

		e.stopPropagation();

		if (!me.isDisabled()) {
			$(me).trigger('click');
		}
	};

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
		elem.addClass('vanilla-label');
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


	var Vanillabox = function(config) {
		var me = this;

		me.targetElems_ = config.targets;
		me.animation_ = Util.getOrDefault(
			config.animation,
			AnimationProvider.get('default')
		);

		me.pager_ = new Pager({
			allowsLoop: config.allowsLoop,
			totalPages: me.targetElems_.length
		});

		me.create();

		me.updatePager_();
		me.updateContent_();
	};

	Vanillabox.DELAYED_LAYOUT_DELAY = 300;

	Vanillabox.prototype.create = function() {
		var me = this;

		if (me.created_) {
			return;
		}
		me.created_ = true;

		// Mask
		var mask = new Mask();
		var maskElem = mask.getElement();
		maskElem.hide();
		$('body').append(maskElem);
		me.mask_ = mask;

		// Frame
		var frame = new Frame();
		var frameElem = frame.getElement();
		if (me.pager_.getTotalPages() > 1) {
			frameElem.addClass('vanilla-group');
		}
		me.frame_ = frame;
		maskElem.append(frameElem);

		// Container
		var container = new Container();
		var containerElem = container.getElement();
		me.container_ = container;
		frameElem.append(containerElem);

		// Title
		var titleLabel = new Label({
			cls: 'vanilla-title'
		});
		me.titleLabel_ = titleLabel;
		frameElem.append(titleLabel.getElement());

		// Pager
		var pagerLabel = new Label({
			cls: 'vanilla-pager'
		});
		me.pagerLabel_ = pagerLabel;
		frameElem.append(pagerLabel.getElement());

		// Previous
		var prevButton = new Button({
			cls: 'vanilla-prev'
		});
		me.prevButton_ = prevButton;
		frameElem.append(prevButton.getElement());

		// Next
		var nextButton = new Button({
			cls: 'vanilla-next'
		});
		me.nextButton_ = nextButton;
		frameElem.append(nextButton.getElement());

		// Close
		var closeButton = new Button({
			cls: 'vanilla-close'
		});
		me.closeButton_ = closeButton;
		frameElem.append(closeButton.getElement());

		me.attach_();
	};

	Vanillabox.prototype.release = function() {
		var me = this;

		me.detach_();

		me.mask_.getElement().remove();
		me.mask_.release();
		me.mask_ = null;

		me.frame_.release();
		me.frame_ = null;

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

		me.created_ = false;
	};

	Vanillabox.prototype.attach_ = function() {
		var me = this;

		$window.on('resize', $.proxy(me.onWindowResize_, me));
		$window.on('scroll', $.proxy(me.onWindowScroll_, me));

		me.targetElems_.on('click', $.proxy(me.onTargetElementClick_, me));

		var maskElem = me.mask_.getElement();
		maskElem.on('click', $.proxy(me.onMaskClick_, me));

		var $pager = $(me.pager_);
		$pager.on('change', $.proxy(me.onPagerChange_, me));

		$(me.closeButton_).on('click', $.proxy(me.onCloseButtonClick_, me));
		$(me.prevButton_).on('click', $.proxy(me.onPreviousButtonClick_, me));
		$(me.nextButton_).on('click', $.proxy(me.onNextButtonClick_, me));
	};

	Vanillabox.prototype.detach_ = function() {
		var me = this;

		$window.off('resize', me.onWindowResize_, me);
		$window.off('scroll', me.onWindowScroll_, me);

		me.targetElems_.off('click', me.onTargetElementClick_);

		var maskElem = me.mask_.getElement();
		maskElem.off('click', me.onMaskClick_);

		var $pager = $(me.pager_);
		$pager.off('change', me.onPagerChange_);

		$(me.closeButton_).off('click', me.onCloseButtonClick_);
		$(me.prevButton_).off('click', me.onPreviousButtonClick_);
		$(me.nextButton_).off('click', me.onNextButtonClick_);

		me.detachContent_();
		me.content_ = null;
	};

	Vanillabox.prototype.attachContent_ = function() {
		var me = this;
		var content = me.getContent_();
		var contentElem = content.getElement();

		$(content).on('complete', $.proxy(me.onContentComplete_, me));
		contentElem.on('click', $.proxy(me.onContentClick_, me));
	};

	Vanillabox.prototype.detachContent_ = function() {
		var me = this;
		var content = me.getContent_();
		var contentElem = content.getElement();

		$(content).off('complete', me.onContentComplete_);
		contentElem.off('click', me.onContentClick_);
	};

	Vanillabox.prototype.show = function(opt_index) {
		var me = this;
		var animation = me.animation_;

		animation.showMask(me.mask_.getElement());

		me.container_.updateMaxContentSize();

		var rect = me.frame_.getPreferredRect();
		animation.showFrame(me.frame_.getElement(), rect);

		me.layout();

		var index = Util.getOrDefault(opt_index, 0);
		me.pager_.setCurrentPage(index);
	};

	Vanillabox.prototype.hide = function() {
		var me = this;

		me.animation_.hideFrame(me.frame_.getElement());
		me.animation_.hideMask(me.mask_.getElement());
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
		return this.container_.getContent();
	};

	Vanillabox.prototype.setContent_ = function(content) {
		var me = this;
		var prevContent = me.getContent_();

		if (prevContent) {
			me.detachContent_();
		}

		me.container_.setContent(content);
		me.attachContent_();

		me.setTitle(content.getTitle());

		me.layout();
	};

	Vanillabox.prototype.layout = function() {
		var me = this;

		me.mask_.layout();

		var rect = me.frame_.getPreferredRect();
		me.animation_.resizeFrame(me.frame_.getElement(), rect);
	};

	Vanillabox.prototype.updatePager_ = function() {
		var me = this;
		var pager = me.pager_;

		var page = pager.getCurrentPage();
		var totalPages = pager.getTotalPages();
		var text =
			String(page + 1) +
			'/' +
			String(totalPages);

		var label = me.pagerLabel_;
		label.setText(text);

		me.prevButton_.setDisabled(!pager.hasPrevious());
		me.nextButton_.setDisabled(!pager.hasNext());
	};

	Vanillabox.prototype.updateContent_ = function() {
		var me = this;
		var index = me.pager_.getCurrentPage();
		var targetElem = $(me.targetElems_[index]);
		var imgContent = new ImageContent({
			path: targetElem.attr('href'),
			title: targetElem.attr('title')
		});

		me.setContent_(imgContent);
	};

	Vanillabox.prototype.delayedLayout_ = function() {
		var me = this;

		if (me.layoutTimeout_) {
			clearTimeout(me.layoutTimeout_);
		}

		me.layoutTimeout_ = setTimeout(function() {
			me.layout();
		}, Vanillabox.DELAYED_LAYOUT_DELAY);
	};

	Vanillabox.prototype.onWindowResize_ = function() {
		this.delayedLayout_();
	};

	Vanillabox.prototype.onWindowScroll_ = function() {
		this.delayedLayout_();
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
		var me = this;

		me.updatePager_();
		me.updateContent_();
	};

	Vanillabox.prototype.onMaskClick_ = function() {
		this.hide();
	};

	Vanillabox.prototype.onCloseButtonClick_ = function() {
		this.hide();
	};

	Vanillabox.prototype.onPreviousButtonClick_ = function() {
		this.previous();
	};

	Vanillabox.prototype.onNextButtonClick_ = function() {
		this.next();
	};

	Vanillabox.prototype.onContentComplete_ = function() {
		var me = this;

		me.layout();
	};

	Vanillabox.prototype.onContentClick_ = function(e) {
		var me = this;

		e.stopPropagation();

		me.next();
	};


	$.fn.vanillabox = function(config) {
		var me = this;
		var setting = $.extend(defaults, config);

		var targetElems = $(me);
		var animation = AnimationProvider.get(setting.animation);

		var box = new Vanillabox({
			allowsLoop: setting.allowsLoop,
			animation: animation,
			targets: targetElems
		});

		return box;
	};
})(jQuery);
