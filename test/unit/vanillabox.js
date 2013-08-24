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
	expect(6);

	var box;

	box = new Vanillabox({
		targets: Util.targets(1)
	});

	box.show().then(function() {
		strictEqual(
			$('.vanilla-mask').length,
			1,
			'Mask element should be appended'
		);
		ok(
			$('.vanilla-mask').is(':visible'),
			'Mask element should be visible'
		);

		return box.show();
	}).then(function() {
		ok(true, 'Twice calling show() should not throw any exception');
		strictEqual(
			$('.vanilla-mask').length,
			1,
			'Mask element should not be duplicated'
		);

		return box.hide();
	}).then(function() {
		strictEqual(
			$('.vanilla-mask').is(':visible'),
			false,
			'Mask element should be hidden'
		);

		return box.hide();
	}).done(function() {
		ok(true, 'Twice calling hide() should not throw any exception');
		start();
	});
});
