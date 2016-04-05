import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import RequestStatuses from 'utils/eventedit/RequestStatuses';
import CheckBox from 'components/modules/checkbox';
import InputCalendar from 'components/modules/input-calendar';
import cx from 'classnames';

import '../style/event-edit-requests.scss';

class RequestItem extends React.Component {

	handleChangeStatus(e){
		let target = e.currentTarget;
		let status = target.getAttribute('data-status');
		EventEditActions.requests.changeRequestStatus(this.props.id, status);
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
			<div className="request-list__body-row">
				<div className="request-list__body-cell">{fullname}</div>
				<div className="request-list__body-cell">{position}</div>
				<div className="request-list__body-cell">{subdivision}</div>
				<div className="request-list__body-cell">
					<div className={buttonsClasses}>
						<button onClick={::this.handleChangeStatus} className="event-btn request-list__add-button" data-status={RequestStatuses.keys.close}>
							<i className="fa fa-plus"></i>
						</button>
						<button onClick={::this.handleChangeStatus} className="event-btn request-list__remove-button" data-status={RequestStatuses.keys.ignore}>
							<i className="fa fa-minus"></i>
						</button>
					</div>
					<div className="request-list__statuses">
						<i className={statusAddedClasses}></i>
						<i className={statusRemovedClasses}></i>
					</div>
				</div>
			</div>
		);
	}
}

class Requests extends React.Component {

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
				<div className="request-list">
					<div className="request-list__header request-list__header--header">
						<div className="request-list__header-row">
							<div onClick={this.handleSort} className="request-list__header-cell request-list__header-cell--w30" data-sort="fullname">
								<span className="request-list__header-cell-name">ФИО</span>
								<span className="caret request-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="request-list__header-cell request-list__header-cell--w25" data-sort="position">
								<span className="request-list__header-cell-name">Должность</span>
								<span className="caret request-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="request-list__header-cell request-list__header-cell--w25" data-sort="subdivision">
								<span className="request-list__header-cell-name">Подразделение</span>
								<span className="caret request-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="request-list__header-cell request-list__header-cell--w20" data-sort="status">
								<span className="request-list__header-cell-name">Статус</span>
								<span className="caret request-list__caret"></span>
							</div>
						</div>
					</div>
					<div className="request-list__table request-list__table--requests">
						<div className="request-list__header">
							<div className="request-list__header-row">
								<div className="request-list__header-cell request-list__header-cell--w30">ФИО</div>
								<div className="request-list__header-cell request-list__header-cell--w25">Должность</div>
								<div className="request-list__header-cell request-list__header-cell--w25">Подразделение</div>
								<div className="request-list__header-cell request-list__header-cell--w20">Статус</div>
							</div>
							{this.props.requestItems.map((item, index) => {
								return <RequestItem key={index} {...item} />
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Requests;