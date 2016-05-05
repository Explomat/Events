var Router = require('./utils/Crossroads');
var Hasher = require('./utils/Hasher');
var Config = require('./config');
var BasicController = require('./controllers/BasicController');
var CalendarController = require('./controllers/CalendarController');
var EventInfoController = require('./controllers/EventInfoController');
var EventEditController = require('./controllers/EventEditController');
var EventNewController = require('./controllers/EventNewController');
var moment = require('moment');

Date.prototype.toJSON = function(){ return moment(this).format(); }

window.onload = function(){

	Router.addRoute(Config.hashes.calendar, function(){
		if (EventInfoController.isLoaded()) {
			EventInfoController.stop();
			return;
		}
		if (EventNewController.isLoaded()) {
			EventNewController.stop();
			return;
		}
		CalendarController.start();
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
		if (EventNewController.isLoaded()) {
			EventNewController.stop();
		}
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


