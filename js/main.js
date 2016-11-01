import 'babel-polyfill';
var Router = require('./utils/Crossroads');
var Hasher = require('./utils/Hasher');
var Config = require('./config');
var BasicController = require('./controllers/BasicController');
var CalendarController = require('./controllers/CalendarController');
var EventInfoController = require('./controllers/EventInfoController');
var EventEditController = require('./controllers/EventEditController');
var EventNewController = require('./controllers/EventNewController');
var ReasonMissEventController = require('./controllers/ReasonMissEventController');
var UtilsForControllers = require('./controllers/UtilsForControllers');
var moment = require('moment');

Date.prototype.toJSON = function(){ return moment(this).format(); }

window.onload = function(){

	Router.addRoute(Config.hashes.calendar, function(){
		UtilsForControllers.unmountModal();
		if (!CalendarController.isLoaded()){
			CalendarController.start();
		}
	});

	Router.addRoute(Config.hashes.eventView, function(id){
		if (!CalendarController.isLoaded()) {
			CalendarController.start().then(function(){
				EventInfoController.start(id);
			});
		}
	    else {
	    	EventInfoController.start(id);
	    }
	});

	Router.addRoute(Config.hashes.eventEdit, function(id){
		EventEditController.start(id);
		CalendarController.isLoaded(false)
	});

	Router.addRoute(Config.hashes.eventNew, function(){
		if (!CalendarController.isLoaded()) {
			CalendarController.start().then(function(){
				EventNewController.start();
			});
		}
	    else {
	    	EventNewController.start();
	    }
	});

	Router.addRoute(Config.hashes.reasonMissEvent, function(){
		ReasonMissEventController.start();
		CalendarController.isLoaded(false);
	});

	function init(curHash){
		//Storage.clear();
		curHash = curHash === '' ? Config.hashes.calendar : curHash;
		BasicController.start();
		Hasher.setHash(curHash);
		
		//changeTabClass('#' + curHash);
		Router.parse(curHash);
	}

	//setup hasher
	function parseHash(newHash){
		//changeTabClass('#' + newHash);
		Router.parse(newHash);
	}

	Hasher.changed.add(parseHash); //parse hash changes
	Hasher.initialized.add(init); //parse initial hash
	
	Hasher.prependHash = '';
	Hasher.init();
}


