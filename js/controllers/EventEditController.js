var React = require('react');
var ReactDOM = require('react-dom');
var EventEdit = require('../components/event-edit');
var EventError = require('../components/EventError');
var EventEditAPI = require('../api/EventEditAPI');
var EventEditActions = require('../actions/EventEditActions');
var Config = require('../config');

var isLoaded = false;

module.exports = {

	isLoaded () {
		return isLoaded;
	},

	start(id){

		var app = document.getElementById(Config.dom.appId) || document.body;
		this.stop(app);
		isLoaded = true;
		//ReactDOM.render(React.createElement(EventEdit.default), app);

		EventEditAPI.getData(id).then(function(eventData){
			EventEditActions.receiveData(eventData);
			ReactDOM.render(React.createElement(EventEdit.default), app);
		}, function(err){
			ReactDOM.render(React.createElement(EventError.default, {error: err}), app);
		});
	},

	stop () {
		var app = document.getElementById(Config.dom.appId) || document.body;
		if (app) ReactDOM.unmountComponentAtNode(app);
		isLoaded = false;
	}
}
