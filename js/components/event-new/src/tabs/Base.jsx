import React from 'react';
import {TextView} from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import LiveSearch from 'components/modules/live-search';
import EventNewActions from 'actions/EventNewActions';

import config from 'config';


class Base extends React.Component {

	handleSelectEducationMethod(payload, value){
		EventNewActions.base.selectEducationMethod(payload, value);
	}

	handleSelectTutor(payload, value){
		EventNewActions.base.selectTutor(payload, value);
	}

	handleChangeName(val){
		EventNewActions.base.changeName(val);
	}

	handleChangeType(e, payload){
		EventNewActions.base.changeType(payload);
	}

	handleChangeCode(e, payload){
		EventNewActions.base.changeCode(payload);
	}

	handleChangeEducationOrg(e, payload){
		EventNewActions.base.changeEducationOrg(payload);
	}

	render(){
		const { educationMethodId, educationMethodValue, tutorId, tutorValue } = this.props;
		return (
			<div className="event-new-base">
				<div className="event-new-base__base">
					<TextView
						onBlur={this.handleChangeName} 
						value={this.props.name} 
						placeholder="Название *" 
						className="event-new-base__name"/>
					<DropDown 
						description="Тип *"
						onChange={this.handleChangeType} 
						items={this.props.types} 
						selectedPayload={this.props.selectedType}
						isReset={true}/>
					<DropDown 
						description="Код *"
						onChange={this.handleChangeCode} 
						items={this.props.codes} 
						selectedPayload={this.props.selectedCode}
						isReset={true}/>
					<DropDown
						description="Обучающая организация *"
						onChange={this.handleChangeEducationOrg} 
						items={this.props.educationOrgs} 
						selectedPayload={this.props.selectedEducationOrgId}
						isReset={true}/>
				</div>
				<div className="event-new-base__additional">
					<LiveSearch
						payload={educationMethodId}
						value={educationMethodValue}
						query={config.url.createPath({action_name: 'forLiveSearchGetEducationMethods'})}
						onSelect={this.handleSelectEducationMethod}
						placeholder="Учебная программа"/>
					<LiveSearch
						payload={tutorId}
						value={tutorValue}
						query={config.url.createPath({action_name: 'forLiveSearchGetCollaborators'})}
						onSelect={this.handleSelectTutor}
						placeholder="Ответственный"/>
				</div>
			</div>
		);
	}
};

export default Base;