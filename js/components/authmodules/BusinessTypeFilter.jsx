var React = require('react');
var DropDown = require('../modules/dropdown/index');

var BusinessTypeFilter = React.createClass({

	handleChangeBusinessType: function(e, payload, text, index) {
		if (this.props.onChange) {
			this.props.onChange(e, payload, text, index);
		}
	},

	render: function() {
		return (
			<DropDown onChange={this.handleChangeBusinessType} items={this.props.items} selectedPayload={this.props.selectedPayload} deviders={[1]} className={"calendar-header__business-type"} classNameButton={"calendar-header__business-type-button"}/>
		);
	}
});

module.exports = BusinessTypeFilter;