const Content = require('./content.js');
const Events = require('./events.js');
const Util = require('./util.js');

/**
 * @constructor
 * @extends Content
 */
class EmptyContent extends Content {
	setup_() {
		super.setup_();

		this.elem_.addClass(Util.CSS_PREFIX + 'empty');
	}

	load() {
		setTimeout(() => {
			$(this).trigger(Events.COMPLETE, true);
		}, 0);
	}
}

module.exports = EmptyContent;
