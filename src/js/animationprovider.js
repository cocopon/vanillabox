const Animation = require('./animation.js');

/**
 * @alias AnimationProvider
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

module.exports = AnimationProvider;
