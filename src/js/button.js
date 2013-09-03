/**
 * @constructor
 */
var Button = function(config) {
	var me = this;

	me.cls_ = config.cls;
	me.disabled_ = Util.getOrDefault(config.disabled, false);

	me.setup_();
};

Button.prototype.setup_ = function() {
	var me = this;

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

Button.prototype.dispose = function() {
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

