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
