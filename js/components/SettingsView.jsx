var React = require('react');
var SettingsStore = require('../stores/SettingsStore');
var SettingsActions = require('../actions/SettingsActions');
var CalendarView = require('./modules/CalendarView');

function getSettingsState() {
	return SettingsStore.getSettings();
}

var SettingsView = React.createClass({

	componentDidMount: function() {
		SettingsStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		SettingsStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getSettingsState());
	},

	getInitialState: function () {
		return getSettingsState();
	},

	render: function(){
		return(
			<CalendarView currentDate={this.state.currentDate} events={this.state.events}/>
		);
	}
});

module.exports = SettingsView;