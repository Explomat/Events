var React = require('react');
var Config = require('../config');

var EventError = React.createClass({

	propTypes: {
		error: React.PropTypes.string.isRequired
	},

	render: function () {
		return (
			<div className="event-info-box">
				<section className="event-info">
					<div className="event-info__header">
						<a href="#calendar" className="close-btn">&times;</a>
					</div>
					<div className="event-info__body">
						<img className="error-img" src={Config.img.eventNotFound}/>
						<div className="error-text">
							<strong>оО...</strong>
						 	<span>{this.props.error}</span>
						 	<span>Попробуйте выбрать другое мероприятие.</span>
						 	<h1>404</h1>
						</div>
					</div>
				</section>
			</div>
		);
	}
});

module.exports = EventError;