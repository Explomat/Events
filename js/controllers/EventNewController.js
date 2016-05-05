var React = require('react');
var ReactDOM = require('react-dom');
var EventNewActions = require('../actions/EventNewActions');
var EventNew = require('../components/event-new');
var Config = require('../config');
var EventNewAPI = require('../api/EventNewAPI');

var isLoaded = false;

module.exports = {

	isLoaded () {
		return isLoaded;
	},
	
	start: function(){
		var appElem = document.getElementById(Config.dom.eventViewModalId) || document.body;

		EventNewAPI.getData().then(function(eventData){
			EventNewActions.receiveData(eventData);
			ReactDOM.render(React.createElement(EventNew.default), appElem);
			isLoaded = true;
		}).catch(function(e){
			console.error(e.stack);
		});
	},

	stop: function () {
		var app = document.getElementById(Config.dom.eventViewModalId);
		if (app) {
			ReactDOM.unmountComponentAtNode(app);
			isLoaded = false;
		}
	}
}