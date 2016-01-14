var React = require('react');
var DropDown = require('../modules/DropDown');

var RegionsFilter = React.createClass({

	handleChangeRegion: function(e, payload, text, index) {
		if (this.props.onChange) {
			this.props.onChange(e, payload, text, index);
		}
	},

	render: function() {
		return (
			<DropDown onChange={this.handleChangeRegion} items={this.props.items} selectedPayload={this.props.selectedPayload} className={"calendar-header__regions"} classNameButton={"calendar-header__regions-button"}/>
		);
	}
});

module.exports = RegionsFilter;