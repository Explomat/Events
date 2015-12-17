var Router = require('./utils/Crossroads');
var Hasher = require('./utils/Hasher');
var Config = require('./config');
var BasicController = require('./controllers/BasicController');
var SettingsController = require('./controllers/SettingsController');

window.onload = function(){

	Router.addRoute('settings', function(){
	    SettingsController.start();
	});

	function init(curHash){
		curHash = curHash === '' ? 'settings' : curHash;
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


