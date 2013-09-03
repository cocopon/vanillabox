/**
 * @param {Object} config Config options.
 * @constructor
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

	me.setup_();
};

Vanillabox.DELAYED_LAYOUT_DELAY = 300;


/** @private */
Vanillabox.prototype.setup_ = function() {
	var me = this;

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

/** @private */
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

/**
 * Disposes the component.
 */
Vanillabox.prototype.dispose = function() {
	var me = this;

	me.detachWindow_();
	me.detach_();

	Util.Array.forEach(me.contents_, function(content) {
		content.dispose();
	});
	me.contents_ = null;

	me.titleLabel_.dispose();
	me.titleLabel_ = null;

	me.pagerLabel_.dispose();
	me.pagerLabel_ = null;

	me.closeButton_.dispose();
	me.closeButton_ = null;

	me.prevButton_.dispose();
	me.prevButton_ = null;

	me.nextButton_.dispose();
	me.nextButton_ = null;

	me.frame_.dispose();
	me.frame_ = null;

	me.mask_.getElement().remove();
	me.mask_.dispose();
	me.mask_ = null;
};

/** @private */
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

/** @private */
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

/** @private */
Vanillabox.prototype.attachWindow_ = function() {
	var me = this;
	var $window = $(window);
	var $document = $(document);

	$window.on('resize', $.proxy(me.onWindowResize_, me));
	$window.on('scroll', $.proxy(me.onWindowScroll_, me));
	$document.on('keyup', $.proxy(me.onDocumentKeyUp_, me));
};

/** @private */
Vanillabox.prototype.detachWindow_ = function() {
	var me = this;
	var $window = $(window);
	var $document = $(document);

	$window.off('resize', me.onWindowResize_, me);
	$window.off('scroll', me.onWindowScroll_, me);
	$document.off('keyup', me.onDocumentKeyUp_, me);
};

/** @private */
Vanillabox.prototype.attachContent_ = function() {
	var me = this;
	var content = me.getContent_();
	var contentElem = content.getElement();

	$(content).on(Events.COMPLETE, $.proxy(me.onContentComplete_, me));
	contentElem.on('click', $.proxy(me.onContentClick_, me));
};

/** @private */
Vanillabox.prototype.detachContent_ = function() {
	var me = this;
	var content = me.getContent_();
	var contentElem = content.getElement();

	$(content).off('complete', me.onContentComplete_);
	contentElem.off('click', me.onContentClick_);
};

/**
 * Shows the component.
 * @param {Number} opt_index Index of a content to show.
 * @return {Promise} Promise object for showing animation.
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
	).then(function() {
		$(me).trigger(Events.SHOW);
	});
};

/**
 * Hides the component.
 * @return {Promise} promise Promise object for hiding operation.
 */
Vanillabox.prototype.hide = function() {
	var me = this;

	if (!me.showed_) {
		return Util.Deferred.emptyPromise();
	}

	return $.when(
		me.animation_.hideFrame(me.frame_),
		me.animation_.hideMask(me.mask_)
	).then(function() {
		me.detachWindow_();
		me.showed_ = false;

		$(me).trigger(Events.HIDE);
	});
};

/** @private */
Vanillabox.prototype.setTitle_ = function(title) {
	var me = this;
	var titleLabel = me.titleLabel_;

	titleLabel.setText(title);
};

/**
 * Shows the previous content.
 */
Vanillabox.prototype.previous = function() {
	this.pager_.previous();
};

/**
 * Shows the next content.
 */
Vanillabox.prototype.next = function() {
	this.pager_.next();
};

/** @private */
Vanillabox.prototype.getContent_ = function() {
	var me = this;
	var container = me.frame_.getContainer();

	return container.getContent();
};

/** @private */
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
	me.setTitle_(content.getTitle());

	content.load();
	container.layout();
};

/** @private */
Vanillabox.prototype.layout_ = function(forceLayout) {
	var me = this;
	var needsResizing = (forceLayout || me.repositionOnScroll_);

	if (needsResizing) {
		me.animation_.resizeFrame(me.frame_);
	}
};

/** @private */
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

/** @private */
Vanillabox.prototype.updateContent_ = function() {
	var me = this;

	me.updatePager_();

	var index = me.pager_.getPage();
	var content = me.contents_[index];
	me.setContent_(content);
};

/** @private */
Vanillabox.prototype.delayedLayout_ = function(forceLayout) {
	var me = this;

	if (me.layoutTimeout_) {
		clearTimeout(me.layoutTimeout_);
	}

	me.layoutTimeout_ = setTimeout(function() {
		me.layout_(forceLayout);
	}, Vanillabox.DELAYED_LAYOUT_DELAY);
};

/** @private */
Vanillabox.prototype.onWindowResize_ = function() {
	this.delayedLayout_(false);
};

/** @private */
Vanillabox.prototype.onWindowScroll_ = function() {
	this.delayedLayout_(false);
};

/** @private */
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

/** @private */
Vanillabox.prototype.onTargetElementClick_ = function(e) {
	var me = this;
	var index = me.targetElems_.index(e.delegateTarget);

	if (index < 0) {
		return;
	}

	e.preventDefault();

	me.show(index);
};

/** @private */
Vanillabox.prototype.onPagerChange_ = function() {
	this.updateContent_();
};

/** @private */
Vanillabox.prototype.onMaskClick_ = function() {
	var me = this;

	if (!me.closeButtonEnabled_) {
		me.hide();
	}
};

/** @private */
Vanillabox.prototype.onCloseButtonClick_ = function() {
	var me = this;

	if (!me.closeButtonEnabled_) {
		return;
	}

	me.hide();
};

/** @private */
Vanillabox.prototype.onPreviousButtonClick_ = function() {
	this.previous();
};

/** @private */
Vanillabox.prototype.onNextButtonClick_ = function() {
	this.next();
};

/** @private */
Vanillabox.prototype.onContentComplete_ = function(e, success) {
/** @private */
	var me = this;

	me.layout_(true);

	$(me).trigger(Events.LOAD, success);
};

/** @private */
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

