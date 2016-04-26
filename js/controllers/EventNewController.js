var React = require('react');
var ReactDOM = require('react-dom');
var EventNewActions = require('../actions/EventNewActions');
var EventNew = require('../components/event-new');
var Config = require('../config');

module.exports = {
	
	start: function(){
		var appElem = document.getElementById(Config.dom.eventViewModalId) || document.body;
		
		ReactDOM.unmountComponentAtNode(appElem);
		EventNewActions.setDefaultData();
		ReactDOM.render(React.createElement(EventNew.default), appElem);
	}
}