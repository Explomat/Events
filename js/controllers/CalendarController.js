var React = require('react');
var ReactDOM = require('react-dom');
var CalendarView = require('../components/CalendarView');
var CalendarAPI = require('../api/CalendarAPI');
var CalendarActions = require('../actions/CalendarActions');
var Config = require('../config');

module.exports = {

	start: function(){
		var app = document.getElementById(Config.dom.appId) || document.body;
		ReactDOM.unmountComponentAtNode(app);

		var calendarData = CalendarAPI.getData();
		CalendarActions.receiveData(calendarData);
		ReactDOM.render(React.createElement(CalendarView), app);
	}
}
