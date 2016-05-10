import React from 'react';
import {TextView} from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import LiveSearch from 'components/modules/live-search';
import EventNewActions from 'actions/EventNewActions';
import EventTypes from 'utils/eventedit/EventTypes';
import cx from 'classnames';

import config from 'config';


class Base extends React.Component {

	handleSelectEducationMethod(payload, value){
		EventNewActions.base.selectEducationMethod(payload, value);
	}

	handleResetEducationMethod(payload, value){
		EventNewActions.base.selectEducationMethod(null, value);
	}

	handleSelectTutor(payload, value){
		EventNewActions.base.selectTutor(payload, value);
	}

	handleResetTutor(payload, value){
		EventNewActions.base.selectTutor(null, value);
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
		const { name, types, codes, educationOrgs, type, code, educationOrgId, educationMethodId, educationMethodValue, tutorId, tutorValue } = this.props;
		const educationMethodClasses = cx({
			'event-new-base__edication-method': true,
			'event-new-base__edication-method--display': type !== EventTypes.keys.one_time
		});
		return (
			<div className="event-new-base">
				<div className="event-new-base__base">
					<TextView
						onBlur={this.handleChangeName} 
						value={name} 
						placeholder="Название *" 
						className="event-new-base__name"/>
					<DropDown 
						description="Тип *"
						onChange={this.handleChangeType} 
						items={types} 
						selectedPayload={type}
						isReset={true}
						className="event-new-base__type"/>
					<DropDown 
						description="Код *"
						onChange={this.handleChangeCode} 
						items={codes} 
						selectedPayload={code}
						isReset={true}
						className="event-new-base__code"/>
					<DropDown
						description="Обучающая организация *"
						onChange={this.handleChangeEducationOrg} 
						items={educationOrgs} 
						selectedPayload={educationOrgId}
						isReset={true}
						className="event-new-base__education-org"/>
				</div>
				<div className="event-new-base__additional">
					<LiveSearch
						limit={6}
						payload={educationMethodId}
						value={educationMethodValue}
						query={config.url.createPath({action_name: 'forLiveSearchGetEducationMethods'})}
						onSelect={this.handleSelectEducationMethod}
						onChange={this.handleResetEducationMethod}
						placeholder="Учебная программа *"
						className={educationMethodClasses}/>
					<LiveSearch
						limit={6}
						payload={tutorId}
						value={tutorValue}
						query={config.url.createPath({action_name: 'forLiveSearchGetCollaborators'})}
						onSelect={this.handleSelectTutor}
						onChange={this.handleResetTutor}
						placeholder="Ответственный *"/>
				</div>
			</div>
		);
	}
};

export default Base;