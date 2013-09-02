/**
 * @constructor
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

