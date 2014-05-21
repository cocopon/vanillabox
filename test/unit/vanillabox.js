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


test('Vanillabox', function() {
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


asyncTest('Vanillabox#(show|hide)', function() {
	expect(9);

	var maskCssClass = Util.cssClass('mask');
	var showedCount = 0;
	var hiddenCount = 0;
	var box;

	box = new Vanillabox({
		targets: Util.targets(1),
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
		strictEqual(
			$('.vnbx').length,
			0,
			'dispose() should remove related elements'
		);

		start();
	});
});


asyncTest('Vanillabox#hide with \'dispose\' option', function() {
	expect(2);

	var box = new Vanillabox({
		targets: Util.targets(1),
		type: 'image',
		dispose: true
	});
	box.show().pipe(function() {
		return box.hide();
	}).pipe(function() {
		strictEqual(
			$('.vnbx-content img').length,
			0,
			'\'dispose\' option should remove all content elements'
		);

		return box.show();
	}).pipe(function() {
		ok(true, 'show() after disposing should not throw any exception');

		return box.hide();
	}).done(function() {
		box.dispose();
		start();
	});
});
