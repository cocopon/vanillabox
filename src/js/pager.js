const Events = require('./events.js');
const Util = require('./util.js');

/**
 * The pager class manages a current page.
 * @constructor
 */
class Pager {
	constructor(opt_config) {
		const config = opt_config || {};

		this.totalPages_ = Util.getOrDefault(config.totalPages, 1);
		this.allowsLoop_ = Util.getOrDefault(config.loop, false);

		this.setPage(Util.getOrDefault(config.page, 0));
	}

	/**
	* @return {Number} Current page of the pager.
	*/
	getPage() {
		return this.currentPage_;
	}

	/**
	* @param {Number} page Current page of the pager.
	*/
	setPage(page) {
		const currentIndex = this.currentPage_;
		const totalPages = this.getTotalPages();
		const newIndex = Math.min(Math.max(page, 0), totalPages - 1);

		this.currentPage_ = newIndex;

		if (currentIndex !== newIndex) {
			$(this).trigger(Events.CHANGE);
		}
	}

	/**
	* @return {Number} Total number of pages of the pager.
	*/
	getTotalPages() {
		return this.totalPages_;
	}

	/**
	* @return {Boolean} true if the current page has a previous page
	*/
	hasPrevious() {
		if (this.allowsLoop_) {
			return true;
		}

		return this.currentPage_ > 0;
	}

	/**
	* @return {Boolean} true if the current page has a next page
	*/
	hasNext() {
		if (this.allowsLoop_) {
			return true;
		}

		const totalPages = this.getTotalPages();
		return this.currentPage_ < totalPages - 1;
	}

	/**
	* Sets the current page to the next page.
	*/
	next() {
		const totalPages = this.getTotalPages();
		const currentIndex = this.currentPage_;
		let nextIndex = currentIndex + 1;

		if (nextIndex > totalPages - 1) {
			nextIndex = this.allowsLoop_ ?
				0 :
				totalPages - 1;
		}
		this.currentPage_ = nextIndex;

		if (currentIndex !== nextIndex) {
			$(this).trigger(Events.CHANGE);
		}
	}

	/**
	* Sets the current page to the previous page.
	*/
	previous() {
		const totalPages = this.getTotalPages();
		const currentIndex = this.currentPage_;
		let prevIndex = currentIndex - 1;

		if (prevIndex < 0) {
			prevIndex = this.allowsLoop_ ?
				totalPages - 1 :
				0;
		}
		this.currentPage_ = prevIndex;

		if (currentIndex !== prevIndex) {
			$(this).trigger(Events.CHANGE);
		}
	}
}

module.exports = Pager;
