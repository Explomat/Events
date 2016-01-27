var React = require('react');
var ReactDOM = require('react-dom');
var EventInfo = require('../components/EventInfo');
var Error = require('../components/Error');
var EventInfoAPI = require('../api/EventInfoAPI');
var EventInfoActions = require('../actions/EventInfoActions');
var Config = require('../config');

module.exports = {

	start: function(id){
		var app = document.getElementById(Config.dom.eventViewModalId) || document.body;
		ReactDOM.unmountComponentAtNode(app);

		EventInfoAPI.getData(id).then(function(eventData){
			EventInfoActions.receiveData(eventData);
			ReactDOM.render(React.createElement(EventInfo), app);
		}, function(err){
			ReactDOM.render(React.createElement(Error, {error: err}), app);
		});
	}
}
