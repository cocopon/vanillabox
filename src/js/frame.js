/**
 * @constructor
 */
var Frame = function(opt_config) {
	var me = this;
	var config = opt_config || {};

	var container = new Container({
		animation: config.animation,
		adjustToWindow: config.adjustToWindow
	});
	me.container_ = container;

	me.setup_();
	me.attach_();
};

Frame.RESIZE_TIMEOUT_DELAY = 500;

Frame.prototype.setup_ = function() {
	var me = this;

	var elem = $('<div>');
	elem.addClass(Util.CSS_PREFIX + 'frame');
	me.elem_ = elem;

	var container = me.container_;
	me.elem_.append(container.getElement());
};

Frame.prototype.dispose = function() {
	var me = this;

	me.container_.dispose();
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
	var $window = $(window);
	var elem = me.getElement();
	var ow = Util.Dom.getViewportWidth();
	var oh = Util.Dom.getViewportHeight();
	var left = Math.round($window.scrollLeft() + (ow - elem.outerWidth()) / 2);
	var top = Math.max(Math.round($window.scrollTop() + (oh - elem.outerHeight()) / 2), 0);

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

