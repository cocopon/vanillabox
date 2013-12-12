/*global
	Util: false,
	ok: false,
	strictEqual: false,
	test: false,
*/
var Container = Util.privateClass('Container');


test('Container#needsAdjustment', function()  {
	var container;

	container = new Container();
	ok(
		container.needsAdjustment('horizontal'),
		'The default of horizontal needsAdjustment should be true'
	);
	ok(
		container.needsAdjustment('vertical'),
		'The default of vertical needsAdjustment should be true'
	);

	container = new Container({adjustToWindow: 'both'});
	ok(
		container.needsAdjustment('horizontal'),
		'Horizontal needsAdjustment for \'both\' should be true'
	);
	ok(
		container.needsAdjustment('vertical'),
		'Vertical needsAdjustment for \'both\' should be true'
	);

	container = new Container({adjustToWindow: 'horizontal'});
	ok(
		container.needsAdjustment('horizontal'),
		'Horizontal needsAdjustment for \'horizontal\' should be true'
	);
	ok(
		!container.needsAdjustment('vertical'),
		'Vertical needsAdjustment for \'horizontal\' should be false'
	);

	container = new Container({adjustToWindow: 'vertical'});
	ok(
		!container.needsAdjustment('horizontal'),
		'Horizontal needsAdjustment \'vertical\' should be false'
	);
	ok(
		container.needsAdjustment('vertical'),
		'Vertical needsAdjustment \'vertical\' should be true'
	);

	container = new Container({adjustToWindow: 'none'});
	ok(
		!container.needsAdjustment('horizontal'),
		'Horizontal needsAdjustment for \'none\' should be false'
	);
	ok(
		!container.needsAdjustment('vertical'),
		'Vertical needsAdjustment for \'none\' should be false'
	);
});
