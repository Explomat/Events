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
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleSaveItems = this.handleSaveItems.bind(this);
		this.handleChangeEventType = this.handleChangeEventType.bind(this);
	}

	state = {
		startDate: moment(),
		isShowModal: false
	}

	handleChangeDate(date) {
		this.setState({startDate: date});
	}

	getModal(){
		return this.state.isShowModal ? <SelectItems
											title={"Обучающая организация"}
											maxSelectedItems={3}
											query={Config.url.createPath({action_name: 'getCollaborators'})}
											onClose={this.handleCloseModal} 
											onSave={this.handleSaveItems}/> : null;
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

	handleShowModal(){
		this.setState({isShowModal: true});
	}

	handleSaveItems(items){
		this.setState({isShowModal: false});
	}

	handleChangeEventType(){

	}

	render(){
		var modal = this.getModal();
		return (
			<div className="event-edit-base">
				<TextView value={this.props.value} placeholder={"Название"} />
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
					<i className="fa fa-clock-o"></i>
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
				{modal}
				<SelectOneItem 
					value={""} 
					placeholder={"Обучающая организация"} 
					title={"Обучающая организация"} 
					query={Config.url.createPath({action_name: 'getCollaborators'})}/>
				<button onClick={this.handleShowModal}>Open modal</button>
			</div>
		);
	}
};

export default Base;