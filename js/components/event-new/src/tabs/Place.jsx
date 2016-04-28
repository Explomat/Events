import React from 'react';
import EventNewActions from 'actions/EventNewActions';
import LiveSearch from 'components/modules/live-search';

class Place extends React.Component {

	_preparePlaces(items){
		return items.map((i) => {
			return {
				payload: i.id,
				value: i.fullname,
				description: i.description
			}
		});
	}

	handleChangePlaces(val){
		EventNewActions.place.getPlaces(val);
	}

	handleSelectPlace(payload, value){
		EventNewActions.place.selectPlace(payload, value);
	}

	render(){
		const places = this._preparePlaces(this.props.places);
		return (
			<div className="event-new-place">
				<LiveSearch
					payload={this.props.selectedPlaceId}
					value={this.props.selectedPlaceValue}
					onChange={this.handleChangePlaces}
					onSelect={this.handleSelectPlace}
					items={places}
					placeholder="Выберите участников"/>
			</div>
		);
	}
};

export default Place;