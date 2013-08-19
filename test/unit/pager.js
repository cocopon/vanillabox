/*global
	asyncTest: false,
	deepEqual: false,
	expect: false,
	module: false,
	notEqual: false,
	notStrictEqual: false,
	ok: false,
	start: false,
	stop: false,
	strictEqual: false,
	test: false,
	throws: false,
	Util: false,
*/
var Pager = Util.privateClass('Pager');
var Events = Util.privateClass('Events');


test('Pager', function() {
	var pager;
	
	ok(Pager, 'Pager');

	pager = new Pager();
	ok(pager, 'new Pager()');
});

test('config.totalPages', function() {
	var pager;

	pager = new Pager();
	strictEqual(pager.getTotalPages(), 1, 'Initial totalPages without config');

	var totalPages = 9;
	pager = new Pager({
		totalPages: totalPages
	});
	strictEqual(pager.getTotalPages(), totalPages, 'Initial totalPages with config');
});

test('config.page', function() {
	var totalPages = 9;
	var pager;

	pager = new Pager();
	strictEqual(pager.getPage(), 0, 'Initial page without config');

	pager = new Pager({
		totalPages: totalPages,
		page: 4
	});
	strictEqual(pager.getPage(), 4, 'Initial page with config');

	pager = new Pager({
		totalPages: totalPages,
		page: -1
	});
	strictEqual(pager.getPage(), 0, 'Initial page with config');

	pager = new Pager({
		totalPages: totalPages,
		page: totalPages
	});
	strictEqual(pager.getPage(), totalPages - 1, 'Initial page with config');
});

test('Pager#setPage', function() {
	var totalPages = 9;
	var pager = new Pager({
		totalPages: totalPages
	});

	pager.setPage(-1);
	strictEqual(pager.getPage(), 0, 'Setting negative page should be setPage(0)');

	pager.setPage(totalPages);
	strictEqual(pager.getPage(), totalPages - 1, 'Setting oversized page should be setPage(total - 1)');
});

test('CHANGE event', function() {
	expect(2);

	var totalPages = 9;
	var pager = new Pager({
		totalPages: totalPages,
		page: 4
	});

	$(pager).on(Events.CHANGE, function() {
		ok(true, 'CHANGE event fired');
	});
	pager.setPage(4);
	pager.setPage(0);  // Fired
	pager.setPage(-1);
	pager.setPage(totalPages - 1);  // Fired
	pager.setPage(totalPages);
});

test('Pager#previous', function() {
	var totalPages = 9;
	var pager = new Pager({
		totalPages: totalPages
	});

	pager.setPage(4);
	pager.previous();
	strictEqual(pager.getPage(), 4 - 1, 'Previous page');

	pager.setPage(0);
	pager.previous();
	strictEqual(pager.getPage(), 0, 'Previous page of a first page should be 0');
});

test('Pager#next', function() {
	var totalPages = 9;
	var pager = new Pager({
		totalPages: totalPages
	});

	pager.setPage(4);
	pager.next();
	strictEqual(pager.getPage(), 4 + 1, 'Next page');

	pager.setPage(totalPages - 1);
	pager.next();
	strictEqual(pager.getPage(), totalPages - 1, 'Next page of a last page should be (total - 1)');
});

test('config.loop', function() {
	var totalPages = 9;
	var pager = new Pager({
		loop: true,
		totalPages: totalPages
	});

	pager.setPage(0);
	pager.previous();
	strictEqual(pager.getPage(), totalPages - 1, 'Previous page of a first page should be (total - 1)');

	pager.setPage(totalPages - 1);
	pager.next();
	strictEqual(pager.getPage(), 0, 'Next page of a last page should be 0');
});
