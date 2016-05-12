import React from 'react';
import cx from 'classnames';
import './style/event-error.scss';
import './style/event-edit-error.scss';

class EventError extends React.Component {

	static propTypes = {
		error: React.PropTypes.string.isRequired,
		className: React.PropTypes.string
	}

	render() {
		const classes = cx('event-error-box', this.props.className);
		return (
			<div className={classes}>
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