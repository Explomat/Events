var React = require('react');
var ReactDOM = require('react-dom');
var Calendar = require('../components/Calendar');
var CalendarAPI = require('../api/CalendarAPI');
var CalendarActions = require('../actions/CalendarActions');
var Config = require('../config');

var isLoaded = false;

module.exports = {

	isLoaded: function () {
		return isLoaded;
	},

	start: function(){
		var app = document.getElementById(Config.dom.appId) || document.body;
		this.stop(app);
		isLoaded = true;

		return CalendarAPI.getData().then(function(calendarData){
			CalendarActions.receiveData(calendarData);
			ReactDOM.render(React.createElement(Calendar), app);
		}.bind(this), function(err){
			console.log(err);
		});
	},

	stop: function () {
		var app = document.getElementById(Config.dom.appId) || document.body;
		if (app) ReactDOM.unmountComponentAtNode(app);
		isLoaded = false;
	}
}
