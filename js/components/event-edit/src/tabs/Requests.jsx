import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import RequestStatuses from 'utils/eventedit/RequestStatuses';
import CheckBox from 'components/modules/checkbox';
import InputCalendar from 'components/modules/input-calendar';
import RejectReasonInfo from '../RejectReasonInfo';
import cx from 'classnames';

import '../style/event-edit-requests.scss';

class RequestItem extends React.Component {

	handleCloseStatus(){
		if (this.props.onCloseStatus){
			this.props.onCloseStatus(this.props.id, RequestStatuses.keys.close);
			//EventEditActions.requests.changeRequestStatus(this.props.id, RequestStatuses.keys.close);
		}
		
	}

	handleIgnoreStatus(){
		if (this.props.onIgnoreStatus){
			this.props.onIgnoreStatus(this.props.id, RequestStatuses.keys.ignore);
			//EventEditActions.requests.changeRequestStatus(this.props.id, RequestStatuses.keys.ignore);
		}
	}

	render(){
		let {fullname, subdivision, position, status} = this.props;
		let buttonsClasses = cx({
			'request-list__buttons': true,
			'request-list__buttons--display': status === RequestStatuses.keys.active
		});
		let statusAddedClasses = cx({
			"fa fa-plus": true, 
			"request-list__status-added": true, 
			"request-list__status-added--display": status === RequestStatuses.keys.close});
		let statusRemovedClasses = cx({
			"fa fa-minus": true,
			"request-list__status-removed": true,
			"request-list__status-removed--display": status === RequestStatuses.keys.ignore});
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{position}</div>
				<div className="table-list__body-cell">{subdivision}</div>
				<div className="table-list__body-cell">
					<div className={buttonsClasses}>
						<button onClick={::this.handleCloseStatus} title="Утвердить заявку" className="event-btn request-list__add-button">
							<i className="fa fa-plus"></i>
						</button>
						<button onClick={::this.handleIgnoreStatus} title="Отклонить заявку" className="event-btn request-list__remove-button">
							<i className="fa fa-minus"></i>
						</button>
					</div>
					<div className="request-list__statuses">
						<i title="Заявка утверждена" className={statusAddedClasses}></i>
						<i title="Заявка отклонена" className={statusRemovedClasses}></i>
					</div>
				</div>
			</div>
		);
	}
}

class Requests extends React.Component {

	constructor(props){
		super(props);
		this.handleIgnoreStatus = this.handleIgnoreStatus.bind(this);
	}

	state = {
		isShowRejectReasonInfo: false,
		rejectRequestId: null,
		rejectRequestStatus: null
	}

	handleChangeIsDateRequestBeforeBegin(checked){
		EventEditActions.requests.changeIsDateRequestBeforeBegin(checked);
	}

	handleChangeRequestBeginDate(date){
		EventEditActions.requests.changeRequestBeginDate(date);
	}

	handleChangeRequestOverDate(date){
		EventEditActions.requests.changeRequestOverDate(date);
	}

	handleChangeIsAutomaticIncludeInCollaborators(checked){
		EventEditActions.requests.changeIsAutomaticIncludeInCollaborators(checked);
	}

	handleChangeIsApproveByBoss(checked){
		EventEditActions.requests.changeIsApproveByBoss(checked);
	}

	handleChangeIsApproveByTutor(checked){
		EventEditActions.requests.changeIsApproveByTutor(checked);
	}

	handleSort(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.requests.sortRequestTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
	}

	handleIgnoreStatus(id, status){
		this.setState({isShowRejectReasonInfo: true, rejectRequestId: id, rejectRequestStatus: status });
	}

	handleCloseStatus(id, status){
		EventEditActions.requests.changeRequestStatus(id, status);
	}

	handleRejectRequest(rejectRequestId, rejectRequestStatus, reason){
		this.setState({isShowRejectReasonInfo: false, rejectRequestId: null, rejectRequestStatus: null});
		EventEditActions.requests.changeRequestStatus(rejectRequestId, rejectRequestStatus, reason);
	}

	handleCloseRejectRequest(){
		this.setState({isShowRejectReasonInfo: false});
	}

	render(){
		let overflowClass = cx({
			"date__overflow": true,
			"date__overflow--display": !this.props.isDateRequestBeforeBegin
		});
		return (
			<div className="event-edit-requests">
				<div className="is-date-requests">
					<CheckBox 
						onChange={this.handleChangeIsDateRequestBeforeBegin} 
						label="Возможна подача заявок"
						checked={this.props.isDateRequestBeforeBegin}/>
					<i className="fa fa-clock-o icon-clock"></i>
					<div className="date">
						<div className={overflowClass}></div>
						<div className="date__start">
							<InputCalendar
								placeholder="C"
								className="date__calendar" 
								date={this.props.requestBeginDate} 
								onSave={this.handleChangeRequestBeginDate} 
								prevMonthIcon='fa fa-angle-left'
								nextMonthIcon='fa fa-angle-right'/>
						</div>
						<div className="date__finish">
							<InputCalendar
								placeholder="По"
								className="date__calendar" 
								date={this.props.requestOverDate} 
								onSave={this.handleChangeRequestOverDate} 
								prevMonthIcon='fa fa-angle-left'
								nextMonthIcon='fa fa-angle-right'/>
						</div>
					</div>
				</div>
				<CheckBox 
					onChange={this.handleChangeIsAutomaticIncludeInCollaborators} 
					label={"Автоматически включать в состав участников"} 
					checked={this.props.isAutomaticIncludeInCollaborators}/>
				<CheckBox 
					onChange={this.handleChangeIsApproveByBoss} 
					label={"Необходимо подтверждение от непосредственного руководителя"} 
					checked={this.props.isApproveByBoss}/>
				<CheckBox 
					onChange={this.handleChangeIsApproveByTutor} 
					label={"Необходимо подтверждение от ответственного за мероприятие"} 
					checked={this.props.isApproveByTutor}/>
				<div className="table-list request-list">
					<div className="table-list__header table-list__header--header">
						<div className="table-list__header-row">
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w30" data-sort="fullname">
								<span className="table-list__header-cell-name">ФИО</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w25" data-sort="position">
								<span className="table-list__header-cell-name">Должность</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w25" data-sort="subdivision">
								<span className="table-list__header-cell-name">Подразделение</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w20" data-sort="status">
								<span className="table-list__header-cell-name">Статус</span>
								<span className="caret table-list__caret"></span>
							</div>
						</div>
					</div>
					<div className="table-list__table">
						<div className="table-list__header">
							<div className="table-list__header-row">
								<div className="table-list__header-cell table-list__header-cell--w30">ФИО</div>
								<div className="table-list__header-cell table-list__header-cell--w25">Должность</div>
								<div className="table-list__header-cell table-list__header-cell--w25">Подразделение</div>
								<div className="table-list__header-cell table-list__header-cell--w20">Статус</div>
							</div>
							{this.props.requestItems.map((item, index) => {
								return (<RequestItem 
											key={index} 
											{...item} 
											onIgnoreStatus={this.handleIgnoreStatus} 
											onCloseStatus={this.handleCloseStatus}/>)
							})}
						</div>
					</div>
					<RejectReasonInfo 
						rejectRequestId={this.state.rejectRequestId}
						rejectRequestStatus={this.state.rejectRequestStatus}
						onClose={::this.handleCloseRejectRequest} 
						onReject={::this.handleRejectRequest} 
						isShow={this.state.isShowRejectReasonInfo}/>
				</div>
			</div>
		);
	}
};

export default Requests;