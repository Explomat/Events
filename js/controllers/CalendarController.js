var React = require('react');
var ReactDOM = require('react-dom');
var CalendarView = require('../components/CalendarView');
var CalendarAPI = require('../api/CalendarAPI');
var CalendarActions = require('../actions/CalendarActions');
var Config = require('../config');

module.exports = {

	isLoaded: false,

	start: function(){
		this.isLoaded = true;
		
		var app = document.getElementById(Config.dom.appId) || document.body;
		ReactDOM.unmountComponentAtNode(app);

		return CalendarAPI.getData().then(function(calendarData){
			CalendarActions.receiveData(calendarData);
			ReactDOM.render(React.createElement(CalendarView), app);
		}, function(err){
			console.log(err);
		});
	}
}
