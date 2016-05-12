var ReactDOM = require('react-dom');
var Config = require('../config');

module.exports = {

	unmountModal(){
		var app = document.getElementById(Config.dom.eventViewModalId);
		if (app) {
			ReactDOM.unmountComponentAtNode(app);
		}
	}
}