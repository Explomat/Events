var React = require('react');
var Config = require('../config');

require('../styles');

var BasicView = React.createClass({

	render: function () {
		return (
			<div className="events">
				<div id={Config.dom.appId}></div>
			</div>
		);
	}
});


module.exports = BasicView;