var Logger = function(elem) {
	var me = this;

	me.elem_ = elem;
};

Logger.zeroFill_ = function(num, digits) {
	var text = String(num);
	var i = text.length;

	while (i < digits) {
		text = '0' + text;
		++i;
	}

	return text;
};

Logger.formatDate_ = function(date) {
	return [
		Logger.zeroFill_(date.getHours(), 2),
		Logger.zeroFill_(date.getMinutes(), 2),
		Logger.zeroFill_(date.getSeconds(), 2)
	].join(':');
};

Logger.prototype.append = function(message) {
	var me = this;
	var elem = me.elem_;

	var time = Logger.formatDate_(new Date());
	var line = time + ' | ' + message;
	elem.html(elem.html() + line + '<br>');

	// Scroll to the bottom
	elem.scrollTop(elem[0].scrollHeight);
};
