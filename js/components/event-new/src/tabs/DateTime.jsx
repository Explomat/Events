import React from 'react';
import InputCalendar from 'components/modules/input-calendar';
import EventNewActions from 'actions/EventNewActions';

class DateTime extends React.Component {

	handleChangeStartDateTime(dateTime){
		EventNewActions.dateTime.changeStartDatetime(dateTime);
	}

	handleChangeFinishDateTime(dateTime){
		EventNewActions.dateTime.changeFinishDateTime(dateTime);
	}

	render(){
		return (
			<div className="event-new-datetime">
				<div className="event-new-date__start">
					<InputCalendar
						placeholder="Дата, время начала *"
						className="event-new-date__calendar" 
						date={this.props.startDateTime} 
						onSave={this.handleChangeStartDateTime}/>
				</div>
				<div className="event-new-date__finish">
					<InputCalendar
						placeholder="Дата, время завершения *"
						className="event-new-date__calendar" 
						date={this.props.finishDateTime} 
						onSave={this.handleChangeFinishDateTime}/>
				</div>
			</div>
		);
	}
};

export default DateTime;