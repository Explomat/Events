import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import {TextView} from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import InputCalendar from 'components/modules/input-calendar';
import SelectOneItem from 'components/modules/select-one-item';
import SelectTree from 'components/modules/select-tree';

import Config from 'config';
import moment from 'moment';
moment.locale('ru');

import '../style/event-edit-base.scss';

class Base extends React.Component {

	constructor(props){
		super(props);
	}

	static defaultProps = {
		places: {nodes:[]}
	}

	handleChangeName(name){
		EventEditActions.changeName(name);
	}

	handleChangeType(e, payload){
		EventEditActions.changeType(payload);
	}

	handleChangeCode(e, payload){
		EventEditActions.changeCode(payload);
	}

	handleChangeStartDateTime(dateTime) {
		EventEditActions.changeStartDateTime(dateTime.format());
	}

	handleChangeFinishDateTime(dateTime) {
		EventEditActions.changeFinishDateTime(dateTime.format());
	}

	handleChangeEducationOrg(e, payload){
		EventEditActions.changeEducationOrg(payload);
	}

	handleChangeEducationMethod(educationMethod){
		EventEditActions.changeEducationMethod(educationMethod);
	}

	handleChangePlace(place){
		EventEditActions.changePlace(place);
	}

	render(){
		return (
			<div className="event-edit-base">
				<TextView
					onBlur={this.handleChangeName} 
					value={this.props.name} 
					placeholder="Название" 
					className="event-edit-base__name"/>
				<DropDown 
					description="Тип мероприятия"
					onChange={this.handleChangeType} 
					items={this.props.types} 
					selectedPayload={this.props.selectedType}
					isReset={true}/>
				<DropDown 
					description="Код мероприятия"
					onChange={this.handleChangeCode} 
					items={this.props.codes} 
					selectedPayload={this.props.selectedCode}
					isReset={true}/>
				<div className="event-edit-base__date-time">
					<i className="fa fa-clock-o icon-clock"></i>
					<div className="date">
						<InputCalendar 
							moment={moment(this.props.startDateTime)} 
							onSave={this.handleChangeStartDateTime} 
							prevMonthIcon='fa fa-angle-left'
							nextMonthIcon='fa fa-angle-right'/>
						<InputCalendar 
							moment={moment(this.props.finishDateTime)} 
							onSave={this.handleChangeFinishDateTime} 
							prevMonthIcon='fa fa-angle-left'
							nextMonthIcon='fa fa-angle-right'/>
					</div>
				</div>
				<DropDown 
					description="Обучающая организация"
					onChange={this.handleChangeEducationOrg} 
					items={this.props.educationOrgs} 
					selectedPayload={this.props.selectedEducationOrgId}
					isReset={true}/>
				<SelectOneItem
					selectedItem={this.props.selectedEducationMethod} 
					placeholder="Учебная программа" 
					modalTitle="Учебная программа"
					query={Config.url.createPath({action_name: 'getEducationMethod'})}
					onSave={this.handleChangeEducationMethod}/>
				<SelectTree 
					nodes={this.props.places.nodes}
					selectedNode={this.props.places.selectedNode} 
					placeholder="Выберите расположение"
					onSave={this.handleChangePlace}
					isExpand={true}/>
			</div>
		);
	}
};

export default Base;