/*global
	$: false,
	Util: false,
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
*/
var Events = Util.privateClass('Events');
var Vanillabox = Util.privateClass('Vanillabox');
var VanillaException = Util.privateClass('VanillaException');

// Delay for waiting to hide content
var PAGING_DELAY = 500;


test('Constructing the box', function() {
	var box;

	throws(
		function() {
			box = new Vanillabox();
		},
		TypeError,
		'Instantiate without config'
	);

	throws(
		function() {
			box = new Vanillabox({
				targets: []
			});
		},
		VanillaException,
		'Instantiate with empty targets'
	);
});


asyncTest('Disposing the box', function() {
	expect(3);

	var box = new Vanillabox({
		targets: Util.generateTargetElements(1),
		type: 'image'
	});
	box.show().pipe(function() {
		notStrictEqual(
			$('.vnbx').length,
			0,
			'show() should add box elements'
		);
		return box.hide();
	}).pipe(function() {
		notStrictEqual(
			$('.vnbx').length,
			0,
			'hide() should not remove box elements'
		);

		box.dispose();

		strictEqual(
			$('.vnbx').length,
			0,
			'hide() should remove box elements'
		);

		start();
	});
});


asyncTest('Changing a page of the box with image contents', function() {
	expect(9);

	// Hidden image contents should be cached
	var box = new Vanillabox({
		targets: Util.generateTargetElements(3),
		type: 'image'
	});
	var nextPage = function() {
		var pager = Util.getPagerOfBox(box);
		var contents = Util.getContentsOfBox(box);
		switch (pager.getPage()) {
			case 0:
				ok(contents[0].isLoaded());
				ok(!contents[1].isLoaded());
				ok(!contents[2].isLoaded());
				box.next();
				break;
			case 1:
				ok(contents[0].isLoaded());
				ok(contents[1].isLoaded());
				ok(!contents[2].isLoaded());
				box.next();
				break;
			case 2:
				ok(contents[0].isLoaded());
				ok(contents[1].isLoaded());
				ok(contents[2].isLoaded());
				box.dispose();
				start();
				break;
		}
	};

	$(box).on(Events.LOAD, function() {
		setTimeout(function() {
			nextPage();
		}, PAGING_DELAY);
	});

	box.show();
});


asyncTest('Changing a page of the box with iframe contents', function() {
	expect(9);

	// Delay for waiting to hide content
	var DELAY = 500;

	// Hidden iframe contents should be unloaded
	var box = new Vanillabox({
		targets: Util.generateTargetElements(3, 'http://example.com/'),
		type: 'iframe'
	});
	var nextPage = function() {
		var pager = Util.getPagerOfBox(box);
		var contents = Util.getContentsOfBox(box);

		switch (pager.getPage()) {
			case 0:
				ok(contents[0].isLoaded());
				ok(!contents[1].isLoaded());
				ok(!contents[2].isLoaded());
				box.next();
				break;
			case 1:
				ok(!contents[0].isLoaded());
				ok(contents[1].isLoaded());
				ok(!contents[2].isLoaded());
				box.next();
				break;
			case 2:
				ok(!contents[0].isLoaded());
				ok(!contents[1].isLoaded());
				ok(contents[2].isLoaded());
				box.dispose();
				start();
				break;
		}
	};

	$(box).on(Events.LOAD, function() {
		setTimeout(function() {
			nextPage();
		}, PAGING_DELAY);
	});

	box.show();
});


asyncTest('Showing/hidng the box', function() {
	expect(8);

	var maskCssClass = Util.cssClass('mask');
	var showedCount = 0;
	var hiddenCount = 0;
	var box = new Vanillabox({
		targets: Util.generateTargetElements(1),
		type: 'image'
	});

	$(box).on(Events.SHOW, function() {
		++showedCount;
	});

	$(box).on(Events.HIDE, function() {
		++hiddenCount;
	});

	// Deferred.pipe is deprecated as of jQuery 1.8. It should be replaced
	// with Deferred.then when we drop support for jQuery 1.7.
	//
	// http://bugs.jquery.com/ticket/11010
	box.show().pipe(function() {
		strictEqual(
			$(maskCssClass).length,
			1,
			'Mask element should be appended'
		);
		ok(
			$(maskCssClass).is(':visible'),
			'Mask element should be visible'
		);

		return box.show();
	}).pipe(function() {
		ok(true, 'Twice calling show() should not throw any exception');
		strictEqual(
			$(maskCssClass).length,
			1,
			'Mask element should not be duplicated'
		);

		return box.hide();
	}).pipe(function() {
		strictEqual(
			$(maskCssClass).is(':visible'),
			false,
			'Mask element should be hidden'
		);

		return box.hide();
	}).pipe(function() {
		ok(true, 'Twice calling hide() should not throw any exception');

		strictEqual(
			showedCount,
			1,
			'Custom event `show` should be fired just one time'
		);

		strictEqual(
			hiddenCount,
			1,
			'Custom event `hide` should be fired just one time'
		);

		box.dispose();

		start();
	});
});
