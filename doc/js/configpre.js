var ConfigPre = function(elem) {
	var me = this;

	me.elem_ = elem;

	me.setConfig();
};

ConfigPre.prototype.getConfig = function() {
	return this.config_;
};

ConfigPre.prototype.setConfig = function(config) {
	var me = this;

	me.config_= config;

	var text =
		'$(\'.foobar a\').vanillabox(' +
		ConfigPre.stringify(me.config_) +
		');';
	me.elem_.text(text);
};

ConfigPre.stringify = function(config) {
	if (!config) {
		return '';
	}

	var props = [];
	var key;
	var value;
	var prop;

	for (key in config) {
		if (config.hasOwnProperty(key)) {
			value = config[key];
			prop =
				'    ' +
				key +
				': ' +
				ConfigPre.stringifyValue(value);
			props.push(prop);
		}
	}

	if (props.length == 0) {
		return '';
	};

	return "{\n" + props.join(",\n") + "\n}";
};

ConfigPre.stringifyValue = function(value) {
	if (typeof(value) === 'string') {
		return '\'' + value + '\'';
	}
	return String(value);
};
