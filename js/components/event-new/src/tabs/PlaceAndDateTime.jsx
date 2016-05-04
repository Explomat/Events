import React from 'react';
import InputCalendar from 'components/modules/input-calendar';
import LiveSearch from 'components/modules/live-search';
import EventNewActions from 'actions/EventNewActions';
import config from 'config';


class PlaceAndDatetime extends React.Component {

	handleChangeStartDateTime(dateTime){
		EventNewActions.placeAndDateTime.changeStartDatetime(dateTime);
	}

	handleChangeFinishDateTime(dateTime){
		EventNewActions.placeAndDateTime.changeFinishDateTime(dateTime);
	}

	handleSelectPlace(payload, value){
		EventNewActions.placeAndDateTime.selectPlace(payload, value);
	}

	handleResetPlace(payload, value){
		EventNewActions.placeAndDateTime.selectPlace(null, value);
	}

	render(){
		return (
			<div className="event-new-place-and-datetime">
				<div className="event-new-place-and-datetime__datetime">
					<InputCalendar
						placeholder="Дата, время начала *"
						className="event-new-place-and-datetime__start-datetime" 
						date={this.props.startDateTime} 
						onSave={this.handleChangeStartDateTime}/>
					<InputCalendar
						placeholder="Дата, время завершения *"
						className="event-new-place-and-datetime__finish-datetime" 
						date={this.props.finishDateTime} 
						onSave={this.handleChangeFinishDateTime}/>
				</div>
				<LiveSearch
					query={config.url.createPath({action_name: 'forLiveSearchGetPlaces'})}
					payload={this.props.placeId}
					value={this.props.placeValue}
					onSelect={this.handleSelectPlace}
					onChange={this.handleResetPlace}
					placeholder="Расположение *"
					className="event-new-place-and-datetime__place"/>
			</div>
		);
	}
};

export default PlaceAndDatetime;