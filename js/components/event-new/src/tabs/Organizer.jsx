import React from 'react';
import EventNewActions from 'actions/EventNewActions';
import LiveSearch from 'components/modules/live-search';

class Organizer extends React.Component {

	_prepareEducationMethods(items){
		return items.map((i) => {
			return {
				payload: i.id,
				value: i.fullname,
				description: i.description
			}
		});
	}

	_prepareTutors(items){
		return items.map((i) => {
			return {
				payload: i.id,
				value: i.fullname,
				description: i.description
			}
		});
	}

	handleChangeEducationOrg(val){
		EventNewActions.getEducationOrgs(val);
	}

	handleChangeEducationMethod(val){
		EventNewActions.getEducationMethods(val);
	}

	handleSelectEducationMethod(payload){
		EventNewActions.selectEducationMethod(payload);
	}

	handleChangeTutor(val){
		EventNewActions.getTutors(val);
	}

	handleSelectTutor(payload){
		EventNewActions.selectTutor(payload);
	}

	render(){
		const educationMethods = this._prepareEducationMethods(this.props.educationMethods);
		const tutors = this._prepareTutors(this.props.tutors);
		return (
			<div className="event-new-place">
				<LiveSearch
					onChange={this.handleChangeEducationMethod}
					onSelect={this.handleSelectEducationMethod}
					items={educationMethods}
					placeholder="Учебная программа"/>
				<LiveSearch
					onChange={this.handleChangeTutor}
					onSelect={this.handleSelectTutor}
					items={tutors}
					placeholder="Ответственный"/>
			</div>
		);
	}
};

export default Organizer;