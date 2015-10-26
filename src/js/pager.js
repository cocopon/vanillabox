const Events = require('./events.js');
const Util = require('./util.js');

/**
 * The pager class manages a current page.
 * @constructor
 */
var Pager = function(opt_config) {
	var me = this;
	var config = opt_config || {};

	me.totalPages_ = Util.getOrDefault(config.totalPages, 1);
	me.allowsLoop_ = Util.getOrDefault(config.loop, false);

	me.setPage(Util.getOrDefault(config.page, 0));
};

/**
 * @return {Number} Current page of the pager.
 */
Pager.prototype.getPage = function() {
	return this.currentPage_;
};

/**
 * @param {Number} page Current page of the pager.
 */
Pager.prototype.setPage = function(page) {
	var me = this;
	var currentIndex = me.currentPage_;
	var totalPages = me.getTotalPages();
	var newIndex = Math.min(Math.max(page, 0), totalPages - 1);

	me.currentPage_ = newIndex;

	if (currentIndex !== newIndex) {
		$(me).trigger(Events.CHANGE);
	}
};

/**
 * @return {Number} Total number of pages of the pager.
 */
Pager.prototype.getTotalPages = function() {
	return this.totalPages_;
};

/**
 * @return {Boolean} true if the current page has a previous page
 */
Pager.prototype.hasPrevious = function() {
	var me = this;

	if (me.allowsLoop_) {
		return true;
	}

	return me.currentPage_ > 0;
};

/**
 * @return {Boolean} true if the current page has a next page
 */
Pager.prototype.hasNext = function() {
	var me = this;

	if (me.allowsLoop_) {
		return true;
	}

	var totalPages = me.getTotalPages();
	return me.currentPage_ < totalPages - 1;
};

/**
 * Sets the current page to the next page.
 */
Pager.prototype.next = function() {
	var me = this;
	var totalPages = me.getTotalPages();
	var currentIndex = me.currentPage_;
	var nextIndex = currentIndex + 1;

	if (nextIndex > totalPages - 1) {
		nextIndex = me.allowsLoop_ ?
			0 :
			totalPages - 1;
	}
	me.currentPage_ = nextIndex;

	if (currentIndex !== nextIndex) {
		$(me).trigger(Events.CHANGE);
	}
};

/**
 * Sets the current page to the previous page.
 */
Pager.prototype.previous = function() {
	var me = this;
	var totalPages = me.getTotalPages();
	var currentIndex = me.currentPage_;
	var prevIndex = currentIndex - 1;

	if (prevIndex < 0) {
		prevIndex = me.allowsLoop_ ?
			totalPages - 1 :
			0;
	}
	me.currentPage_ = prevIndex;

	if (currentIndex !== prevIndex) {
		$(me).trigger(Events.CHANGE);
	}
};

module.exports = Pager;
