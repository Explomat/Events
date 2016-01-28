var React = require('react');
var ReactDOM = require('react-dom');
var EventInfo = require('../components/EventInfo');
var Error = require('../components/Error');
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
			EventInfoActions.receiveData(eventData);
			ReactDOM.render(React.createElement(EventInfo), app);
		}, function(err){
			ReactDOM.render(React.createElement(Error, {error: err}), app);
		});
	},

	stop: function () {
		var app = document.getElementById(Config.dom.eventViewModalId) || document.body;
		if (app) ReactDOM.unmountComponentAtNode(app);
		isLoaded = false;
	}
}
