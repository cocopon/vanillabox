/**
 * @constructor
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

	$(window).on('resize', $.proxy(me.onWindowResize_, me));

	var elem = me.getElement();
	elem.on('click', $.proxy(me.onClick_, me));
};

Mask.prototype.detach_ = function() {
	var me = this;

	$(window).off('resize', me.onWindowResize_);

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

	var $window = $(window);
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
