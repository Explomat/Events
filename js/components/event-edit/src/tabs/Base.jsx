import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import {TextView} from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import InputCalendar from 'components/modules/input-calendar';
import SelectOneItem from 'components/modules/select-one-item';
import SelectTree from 'components/modules/select-tree';
import EventTypes from 'utils/eventedit/EventTypes';
import cx from 'classnames';

import Config from 'config';

import '../style/event-edit-base.scss';

class Base extends React.Component {

	constructor(props){
		super(props);
	}

	static defaultProps = {
		places: {nodes:[]}
	}

	handleChangeName(name){
		EventEditActions.base.changeName(name);
	}

	handleChangeType(e, payload){
		EventEditActions.base.changeType(payload);
	}

	handleChangeCode(e, payload){
		EventEditActions.base.changeCode(payload);
	}

	handleChangeStartDateTime(dateTime) {
		EventEditActions.base.changeStartDateTime(dateTime);
	}

	handleChangeFinishDateTime(dateTime) {
		EventEditActions.base.changeFinishDateTime(dateTime);
	}

	handleChangeEducationOrg(e, payload){
		EventEditActions.base.changeEducationOrg(payload);
	}

	handleChangeEducationMethod(educationMethod){
		EventEditActions.base.changeEducationMethod(educationMethod);
	}

	handleChangePlace(place){
		EventEditActions.base.changePlace(place);
	}

	render(){
		const educationMethodlasses = cx({
			'event-edit-base__edication-method': true,
			'event-edit-base__edication-method--display': this.props.selectedType !== EventTypes.keys.one_time
		})
		return (
			<div className="event-edit-base">
				<TextView
					onBlur={this.handleChangeName} 
					value={this.props.name} 
					placeholder="Название *" 
					className="event-edit-base__name"/>
				<DropDown 
					description="Тип мероприятия *"
					onChange={this.handleChangeType} 
					items={this.props.types} 
					selectedPayload={this.props.selectedType}
					isReset={true}/>
				<DropDown 
					description="Код мероприятия *"
					onChange={this.handleChangeCode} 
					items={this.props.codes} 
					selectedPayload={this.props.selectedCode}
					isReset={true}/>
				<div className="event-edit-base__date-time">
					<div className="date">
						<div className="date__start">
							<InputCalendar
								placeholder="Дата, время начала *"
								className="date__calendar" 
								date={this.props.startDateTime} 
								onSave={this.handleChangeStartDateTime}/>
						</div>
						<div className="date__finish">
							<InputCalendar
								placeholder="Дата, время завершения *"
								className="date__calendar" 
								date={this.props.finishDateTime} 
								onSave={this.handleChangeFinishDateTime}/>
						</div>
					</div>
				</div>
				<DropDown
					description="Обучающая организация *"
					onChange={this.handleChangeEducationOrg} 
					items={this.props.educationOrgs} 
					selectedPayload={this.props.selectedEducationOrgId}
					isReset={true}/>
				<SelectOneItem
					className={educationMethodlasses}
					selectedItem={this.props.selectedEducationMethod} 
					placeholder="Учебная программа *" 
					modalTitle="Выберите учебную программу"
					query={Config.url.createPath({action_name: 'getEducationMethod'})}
					onSave={this.handleChangeEducationMethod}/>
				<SelectTree 
					nodes={this.props.places.nodes}
					selectedNode={this.props.places.selectedNode} 
					placeholder="Расположение *"
					modalTitle="Выберите расположение"
					onSave={this.handleChangePlace}
					isExpand={true}/>
			</div>
		);
	}
};

export default Base;