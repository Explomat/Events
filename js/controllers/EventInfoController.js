var React = require('react');
var ReactDOM = require('react-dom');
var EventInfo = require('../components/EventInfo');
var EventError = require('../components/event-error');
var EventInfoAPI = require('../api/EventInfoAPI');
var EventInfoActions = require('../actions/EventInfoActions');
var Config = require('../config');

var isLoaded = false;

module.exports = {

	isLoaded: function () {
		return isLoaded;
	},

	start: function(id){

		var app = document.getElementById(Config.dom.eventViewModalId) || document.body;
		this.stop(app);
		isLoaded = true;

		EventInfoAPI.getData(id).then(function(eventData){
			var error = eventData.error;
			if (!error) {
				EventInfoActions.receiveData(eventData);
				ReactDOM.render(React.createElement(EventInfo.default), app);
			}
			else {
				ReactDOM.render(React.createElement(EventError.default, {error: error}), app);
			}
			
		}, function(err){
			ReactDOM.render(React.createElement(EventError.default, {error: err}), app);
		}).catch(function(e){
			console.error(e.stack);
		});
	},

	stop: function () {
		var app = document.getElementById(Config.dom.eventViewModalId) || document.body;
		if (app) ReactDOM.unmountComponentAtNode(app);
		isLoaded = false;
	}
}
