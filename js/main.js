var Router = require('./utils/Crossroads');
var Hasher = require('./utils/Hasher');
var Storage = require('./utils/Storage');
var BasicController = require('./controllers/BasicController');
var CalendarController = require('./controllers/CalendarController');
var EventInfoController = require('./controllers/EventInfoController');

window.onload = function(){

	Router.addRoute('calendar', function(){
		CalendarController.start();
	});

	Router.addRoute('event/view/{id}', function(id){
		if (!CalendarController.isLoaded) {
			CalendarController.start().then(function(){
				EventInfoController.start(id);
			});
		}
	    else EventInfoController.start(id);
	});

	function init(curHash){
		Storage.clear();
		curHash = curHash === '' ? 'calendar' : curHash;
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


