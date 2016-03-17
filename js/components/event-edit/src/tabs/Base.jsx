import React from 'react';
import {TextView} from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import InputCalendar from 'components/modules/input-calendar';
import SelectItems from 'components/modules/select-items';
import SelectOneItem from 'components/modules/select-one-item';

import Config from 'config';
import moment from 'moment';
moment.locale('ru');

import '../style/event-edit-base.scss';

class Base extends React.Component {

	constructor(props){
		super(props);
		this.handleChangeDate = this.handleChangeDate.bind(this);
		this.handleSaveItems = this.handleSaveItems.bind(this);
		this.handleChangeEventType = this.handleChangeEventType.bind(this);
		this.handleChangeOrg = this.handleChangeOrg.bind(this);
		this.handleChangeEducation = this.handleChangeEducation.bind(this);
	}

	state = {
		startDate: moment(),
		selectedItemOrg: null,
		selectedItemEducation: null
	}

	handleChangeDate(date) {
		this.setState({startDate: date});
	}

	handleSaveItems(items){
		this.setState({isShowModal: false});
	}

	handleChangeEventType(){

	}

	handleChangeOrg(item) {
		this.setState({selectedItemOrg: item});
	}

	handleChangeEducation(item){
		this.setState({selectedItemEducation: item});
	}

	render(){
		return (
			<div className="event-edit-base">
				<TextView value={this.props.value} placeholder={"Название"} className="event-edit-base__name"/>
				<DropDown 
					description={"Тип мероприятия"}
					onChange={this.handleChangeEventType} 
					items={this.props.eventTypes} 
					selectedPayload={this.props.selectedEventType}/>
				<DropDown 
					description={"Код мероприятия"}
					onChange={this.handleChangeEventType} 
					items={this.props.eventTypes} 
					selectedPayload={this.props.selectedEventType}/>
				<div className="event-edit-base__date-time">
					<i className="fa fa-clock-o icon-clock"></i>
					<div className="date">
						<InputCalendar 
							moment={this.state.startDate} 
							onChange={this.handleChangeDate} 
							prevMonthIcon={'fa fa-angle-left'}
							nextMonthIcon={'fa fa-angle-right'}/>
						<InputCalendar 
							moment={this.state.startDate} 
							onChange={this.handleChangeDate} 
							prevMonthIcon={'fa fa-angle-left'}
							nextMonthIcon={'fa fa-angle-right'}/>
					</div>
				</div>
				<SelectOneItem
					selectedItem={this.state.selectedItemOrg} 
					placeholder={"Обучающая организация"} 
					modalTitle={"Обучающая организация"} 
					query={Config.url.createPath({action_name: 'getCollaborators'})}
					onChange={this.handleChangeOrg}/>
				<SelectOneItem
					selectedItem={this.state.selectedItemEducation} 
					placeholder={"Учебная программа"} 
					modalTitle={"Учебная программа"} 
					query={Config.url.createPath({action_name: 'getCollaborators'})}
					onChange={this.handleChangeEducation}/>
				<TextView value={this.props.value} placeholder={"Место проведения"} />
			</div>
		);
	}
};

export default Base;