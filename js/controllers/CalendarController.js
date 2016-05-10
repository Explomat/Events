var React = require('react');
var ReactDOM = require('react-dom');
var Calendar = require('../components/Calendar');
var CalendarAPI = require('../api/CalendarAPI');
var CalendarActions = require('../actions/CalendarActions');
var Config = require('../config');

var isLoaded = false;

var exp = {

	isLoaded: function (_isLoaded) {
		if (_isLoaded !== null && _isLoaded !== undefined){
			isLoaded = _isLoaded;
		}
		return isLoaded;
	},

	start: function(){
		var app = document.getElementById(Config.dom.appId) || document.body;
		
		return CalendarAPI.getData().then(function(calendarData){
			CalendarActions.receiveData(calendarData);
			ReactDOM.render(React.createElement(Calendar.default), app);
			isLoaded = true;
		}.bind(this), function(err){
			console.log(err);
		});
	}
}

if(module.hot) {
	module.hot.accept('../components/Calendar', function() {
		Calendar = require('../components/Calendar').default;
		exp.start();
	});
}

module.exports = exp;

