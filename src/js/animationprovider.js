const Animation = require('./animation.js');

/**
 * @alias AnimationProvider
 */
class AnimationProvider {
	static get(id) {
		const animation = AnimationProvider.ANIMATIONS_[id];
		return animation || AnimationProvider.getDefault();
	}

	static getDefault() {
		return Animation.Default;
	}
}

AnimationProvider.ANIMATIONS_ = {
	'none': Animation.None,
	'default': Animation.Default
};

module.exports = AnimationProvider;
