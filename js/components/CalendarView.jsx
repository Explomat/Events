var React = require('react');
var CalendarStore = require('../stores/CalendarStore');
var CalendarActions = require('../actions/CalendarActions');
var Calendar = require('./modules/Calendar');

function getSettingsState() {
	return CalendarStore.getData();
}

var CalendarView = React.createClass({

	componentDidMount: function() {
		CalendarStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		CalendarStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getSettingsState());
	},

	getInitialState: function () {
		return getSettingsState();
	},

	render: function(){
		return(
			<Calendar currentDate={this.state.currentDate} selectedDate={this.state.selectedDate} events={this.state.events} selectedMonthIndex={this.state.selectedMonthIndex}/>
		);
	}
});

module.exports = CalendarView;