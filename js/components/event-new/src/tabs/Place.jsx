import React from 'react';
import EventNewActions from 'actions/EventNewActions';
import LiveSearch from 'components/modules/live-search';
import config from 'config';

class Place extends React.Component {

	handleSelectPlace(payload, value){
		EventNewActions.place.selectPlace(payload, value);
	}

	render(){
		return (
			<div className="event-new-place">
				<LiveSearch
					query={config.url.createPath({action_name: 'forLiveSearchGetPlaces'})}
					payload={this.props.placeId}
					value={this.props.placeValue}
					onSelect={this.handleSelectPlace}
					placeholder="Расположение *"/>
			</div>
		);
	}
};

export default Place;