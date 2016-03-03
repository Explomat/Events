var Router = require('./utils/Crossroads');
var Hasher = require('./utils/Hasher');
//var Storage = require('./utils/Storage');
var Config = require('./config');
var BasicController = require('./controllers/BasicController');
var CalendarController = require('./controllers/CalendarController');
var EventInfoController = require('./controllers/EventInfoController');
var EventEditController = require('./controllers/EventEditController');

window.onload = function(){

	Router.addRoute(Config.hashes.calendar, function(){
		if (EventInfoController.isLoaded()) {
			EventInfoController.stop();
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
	    else EventInfoController.start(id);
	});

	Router.addRoute(Config.hashes.eventEdit, function(id){
		EventEditController.start(id);
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
	Hasher.init(); //start listening for history change
}


