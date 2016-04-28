var React = require('react');
var ReactDOM = require('react-dom');
var EventNewActions = require('../actions/EventNewActions');
var EventNew = require('../components/event-new');
var Config = require('../config');
var EventNewAPI = require('../api/EventNewAPI');

module.exports = {
	
	start: function(){
		var appElem = document.getElementById(Config.dom.eventViewModalId) || document.body;

		EventNewAPI.getData().then(function(eventData){
			ReactDOM.unmountComponentAtNode(appElem);
			EventNewActions.receiveData(eventData);
			ReactDOM.render(React.createElement(EventNew.default), appElem);
		}).catch(function(e){
			console.error(e.stack);
		});
	}
}