/**
 * @constructor
 */
var Label = function(config) {
	var me = this;

	me.cls_ = config.cls;

	me.setup_();
};

Label.prototype.setup_ = function() {
	var me = this;

	var elem = $('<div>');
	elem.addClass(Util.CSS_PREFIX + 'label');
	if (me.cls_) {
		elem.addClass(me.cls_);
	}
	me.elem_ = elem;
};

Label.prototype.dispose = function() {
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

