/**
 * @constructor
 */
var BooleanField = function(config) {
	var me = this;

	var elem = $('<input type="checkbox">');
	me.elem_ = elem;

	me.name_ = config.name;
	me.setValue(config.value);

	me.attach_();
};

BooleanField.prototype.attach_ = function() {
	var me = this;
	me.elem_.on('change', $.proxy(me.onChange_, me));
};

BooleanField.prototype.getElement = function() {
	return this.elem_;
};

BooleanField.prototype.getName = function() {
	return this.name_;
};

BooleanField.prototype.getValue = function() {
	return !!this.elem_.is(':checked');
};

BooleanField.prototype.setValue = function(value) {
	this.elem_.attr('checked', value);
};

BooleanField.prototype.onChange_ = function() {
	$(this).trigger('change');
};


/**
 * @constructor
 */
var SelectField = function(config) {
	var me = this;

	var elem = $('<select>');
	var opts = config.value;
	var len = opts.length;
	var i;
	var optElem;

	for (i = 0; i < len; i++) {
		optElem = $('<option>');
		optElem.attr('value', opts[i]);
		optElem.text(opts[i]);
		elem.append(optElem);
	}

	me.elem_ = elem;

	me.name_ = config.name;
	me.setValue(opts[i]);

	me.attach_();
};

SelectField.prototype.attach_ = function() {
	var me = this;
	me.elem_.on('change', $.proxy(me.onChange_, me));
};

SelectField.prototype.getElement = function() {
	return this.elem_;
};

SelectField.prototype.getName = function() {
	return this.name_;
};

SelectField.prototype.getValue = function() {
	return this.elem_.val();
};

SelectField.prototype.setValue = function(value) {
	this.elem_.val(value);
};

SelectField.prototype.onChange_ = function() {
	$(this).trigger('change');
};


/**
 * @constructor
 */
var ConfigRow = function(config) {
	var me = this;

	me.config_ = config;

	me.create();

	me.updateEnabled_();
};

ConfigRow.FIELD_CLASSES = {
	'boolean': BooleanField,
	'select': SelectField
};

ConfigRow.prototype.create = function() {
	var me = this;

	if (me.elem_) {
		return;
	}

	var config = me.config_;
	var elem = $('<tr>');
	var tdElem;

	// enabled
	var checkboxElem;
	tdElem = $('<td>');
	tdElem.addClass('config-enabled-cell');
	checkboxElem = $('<input type="checkbox">');
	tdElem.append(checkboxElem);
	elem.append(tdElem);
	me.checkboxElem_ = checkboxElem;

	// name
	tdElem = $('<td>');
	tdElem.addClass('config-name-cell');
	tdElem.text(config.name);
	elem.append(tdElem);

	// description
	tdElem = $('<td>');
	tdElem.addClass('config-desc-cell');
	tdElem.text(config.description);
	elem.append(tdElem);

	// field
	var FieldClass = ConfigRow.FIELD_CLASSES[config.type];
	var field = new FieldClass(config);
	tdElem = $('<td>');
	tdElem.addClass('config-field-cell');
	tdElem.append(field.getElement());
	elem.append(tdElem);
	me.field_ = field;

	me.elem_ = elem;

	me.attach_();
};

ConfigRow.prototype.attach_ = function() {
	var me = this;

	var checkboxElem = me.checkboxElem_;
	$(checkboxElem).on('change', $.proxy(me.onCheckboxChange_, me));

	var field = me.field_;
	$(field).on('change', $.proxy(me.onFieldChange_, me));
};

ConfigRow.prototype.getElement = function() {
	return this.elem_;
};

ConfigRow.prototype.getField = function() {
	return this.field_;
};

ConfigRow.prototype.isEnabled = function() {
	var me = this;
	return me.checkboxElem_.is(':checked');
};

ConfigRow.prototype.setEnabled = function(enabled) {
	var me = this;

	me.checkboxElem_.attr('checked', enabled);
	me.updateEnabled_();
};

ConfigRow.prototype.updateEnabled_ = function() {
	var me = this;
	var enabled = me.isEnabled();

	me.elem_.toggleClass('config-row-disabled', !enabled);
};

ConfigRow.prototype.onCheckboxChange_ = function() {
	var me = this;

	me.updateEnabled_();
	$(me).trigger('change');
};

ConfigRow.prototype.onFieldChange_ = function() {
	var me = this;

	me.setEnabled(true);
	$(me).trigger('change');
};


/**
 * @constructor
 */
var ConfigForm = function(elem) {
	var me = this;

	me.elem_ = elem;

	me.create();
};

ConfigForm.HEADERS = [
	'Enabled',
	'Name',
	'Description',
	'Value'
];
ConfigForm.CONFIGS = [
	{
		name: 'animation',
		type: 'select',
		value: ['default', 'none'],
		description: 'Animation type. Set \'none\' to disable animation.'
	},
	{
		name: 'closeButton',
		type: 'boolean',
		value: false,
		description: 'Visibility of the close button. If true, the mask will be unclickable.'
	}, {
		name: 'keyboard',
		type: 'boolean',
		value: true,
		description: 'If false, keyboard operations will be disabled.'
	}, {
		name: 'loop',
		type: 'boolean',
		value: false,
		description: 'If true, grouped images will become a continuous loop.'
	}, {
		name: 'repositionOnScroll',
		type: 'boolean',
		value: false,
		description: 'If true, reposition on scroll will be enabled.'
	}
];

ConfigForm.prototype.create = function() {
	var me = this;
	var elem = me.getElement();
	var len;
	var i;

	if (me.tableElem_) {
		return;
	}

	var tableElem = $('<table>');
	me.tableElem_ = tableElem;

	var rowElem = $('<tr>');
	var thElem;
	len = ConfigForm.HEADERS.length;
	for (i = 0; i < len; i++) {
		thElem = $('<th>');
		thElem.text(ConfigForm.HEADERS[i]);
		rowElem.append(thElem);
	}
	tableElem.append(rowElem);

	var config;
	var row;
	len = ConfigForm.CONFIGS.length;
	me.rows_ = [];
	for (i = 0; i < len; i++) {
		config = ConfigForm.CONFIGS[i];

		row = new ConfigRow(config);
		tableElem.append(row.getElement());
		me.rows_.push(row);
	}

	elem.append(tableElem);

	me.attach_();
};

ConfigForm.prototype.attach_ = function() {
	var me = this;
	var len = me.rows_.length;
	var i;
	var row;

	for (i = 0; i < len; i++) {
		row = me.rows_[i];
		$(row).on('change', $.proxy(me.onRowChange_, me));
	}
};

ConfigForm.prototype.getElement = function() {
	return this.elem_;
};

ConfigForm.prototype.buildConfig = function() {
	var me = this;
	var rows = me.rows_;
	var len = rows.length;
	var config = {};
	var i;
	var row;
	var field;

	for (i = 0; i < len; i++) {
		row = rows[i];

		if (row.isEnabled()) {
			field = row.getField();
			config[field.getName()] = field.getValue();
		}
	}

	return config;
};

ConfigForm.prototype.onRowChange_ = function() {
	$(this).trigger('change');
};
