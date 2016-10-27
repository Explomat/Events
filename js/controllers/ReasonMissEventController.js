var React = require('react');
var ReactDOM = require('react-dom');
var ReasonMissEventActions = require('../actions/ReasonMissEventActions');
var ReasonMissEvent = require('../components/reason-miss-event');
var EventError = require('../components/event-error');
var Config = require('../config');
var ReasonMissEventAPI = require('../api/ReasonMissEventAPI');

var isLoaded = false;

module.exports = {

	isLoaded () {
		return isLoaded;
	},
	
	start: function(){
		var appElem = document.getElementById(Config.dom.appId) || document.body;

		ReasonMissEventAPI.isDeniedActionAccess('reasonMissEvent').then(function(isDenied) {
			if (!isDenied) {
				ReasonMissEventAPI.getData().then(function(data){
					ReasonMissEventActions.receiveData(data);
					ReactDOM.render(React.createElement(ReasonMissEvent.default), appElem);
					isLoaded = true;
				}).catch(function(err){
					ReactDOM.render(React.createElement(EventError.default, {error: err || err.message, className: 'event-edit-error-box'}), appElem);
				});
			}
			else {
				ReactDOM.render(React.createElement(EventError.default, {error: "У вас нет прав!", className: 'event-edit-error-box'}), appElem);
			} 
		}, function(err){
			ReactDOM.render(React.createElement(EventError.default, {error: err || err.message, className: 'event-edit-error-box'}), appElem);
		})
	},

	stop: function () {
		var app = document.getElementById(Config.dom.appId);
		if (app) {
			ReactDOM.unmountComponentAtNode(app);
			isLoaded = false;
		}
	}
}