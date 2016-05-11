import React from 'react';
import Config from '../config';

class EventError extends React.Component {

	static propTypes = {
		error: React.PropTypes.string.isRequired,
		className: React.PropTypes.string
	}

	render () {
		return (
			<div className="event-error-box">
				<section className="event-error">
					<div className="event-error__header">
						<a href="#calendar" className="close-btn">&times;</a>
					</div>
					<div className="event-error__body">
						<img className="event-error__error-img"/>
						<div className="event-error__error-text">
						 	<span>{this.props.error}</span>
						 	<span>Попробуйте выбрать другое мероприятие.</span>
						</div>
					</div>
				</section>
			</div>
		);
	}
}

export default EventError;