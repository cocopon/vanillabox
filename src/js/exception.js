/**
 * @constructor
 */
class VanillaException {
	constructor(type) {
		this.type_ = type;
	}

	getType() {
		return this.type_;
	}
}

VanillaException.Types = {
	INVALID_TYPE: 'invalid_type',
	NO_IMAGE: 'no_image'
};

module.exports = VanillaException;
