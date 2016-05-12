import React from 'react';
import './style/event-error.scss';

class EventError extends React.Component {

	static propTypes = {
		error: React.PropTypes.string.isRequired
	}

	render() {
		return (
			<div className="event-error-box">
				<div className="event-error">
					<div className="event-error__content">
						<div className="event-error__header">
							<a href="#calendar" className="close-btn">&times;</a>
						</div>
						<div className="event-error__body">
							<div className="event-error__error-text">
								<h1 className="event-error__oops">Oops!</h1>
							 	<h3>{this.props.error}</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default EventError;