const Container = require('./container.js');
const DefaultConfig = require('./default_config.js');
const Events = require('./events.js');
const Pager = require('./pager.js');
const Util = require('./util.js');
const Vanillabox = require('./vanillabox.js');
const VanillaException = require('./exception.js');

// For testing of private classes
$.fn.vanillabox['privateClasses_'] = {
	'Container': Container,
	'Events': Events,
	'DEFAULT_CONFIG': DefaultConfig,
	'Pager': Pager,
	'Util': Util,
	'Vanillabox': Vanillabox,
	'VanillaException': VanillaException
};
