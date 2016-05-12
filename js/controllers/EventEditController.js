var React = require('react');
var ReactDOM = require('react-dom');
var EventEdit = require('../components/event-edit');
var EventError = require('../components/event-error');
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

		EventEditAPI.isDeniedActionAccess('edit').then(function(isDenied) {
			if (!isDenied){
				EventEditAPI.getData(id).then(function(eventData){
					var error = eventData.error;
					if (!error) {
						EventEditActions.receiveData(eventData);
						ReactDOM.render(React.createElement(EventEdit.default), app);
						isLoaded = true;
					}else {
						ReactDOM.render(React.createElement(EventError.default, {error: error}), app);
					}
				}, function(err){
					ReactDOM.render(React.createElement(EventError.default, {error: err.message}), app);
				}).catch(function(e){
					console.error(e.stack);
				});
			}
			else {
				ReactDOM.render(React.createElement(EventError.default, {error: "У вас нет доступа к редактированию этого мероприятия!", className: 'event-edit-error-box'}), app);
			}
		});
	}
}
