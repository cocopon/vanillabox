/*global
	$: false,
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
	expect(8);

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
	}).done(function() {
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

		start();
	});
});
