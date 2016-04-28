import React from 'react';
import {TextView} from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import LiveSearch from 'components/modules/live-search';
import EventNewActions from 'actions/EventNewActions';


class Base extends React.Component {

	_prepareItems(items){
		return items.map((i) => {
			return {
				payload: i.id,
				value: i.fullname,
				description: i.description
			}
		});
	}

	handleChangeEducationMethod(val){
		EventNewActions.base.getEducationMethods(val);
	}

	handleSelectEducationMethod(payload){
		EventNewActions.base.selectEducationMethod(payload);
	}

	handleChangeTutor(val){
		EventNewActions.base.getTutors(val);
	}

	handleSelectTutor(payload){
		EventNewActions.base.selectTutor(payload);
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
		const educationMethods = this._prepareItems(this.props.educationMethods);
		const tutors = this._prepareItems(this.props.tutors);
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
			</div>
		);
	}
};

export default Base;