var React = require('react');

var Error = React.createClass({

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
						{this.props.error}
					</div>
					<div className="event-info__footer">
					</div>
				</section>
			</div>
		);
	}
});

module.exports = Error;