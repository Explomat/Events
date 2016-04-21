import React from 'react';
import ReactDOM from 'react-dom';
import EventEditActions from 'actions/EventEditActions';
import RequestStatuses from 'utils/eventedit/RequestStatuses';
import CheckBox from 'components/modules/new-checkbox';
import DropDownIcon from 'components/modules/dropdown-icon';
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
		const {fullname, subdivision, position, status} = this.props;
		const buttonsClasses = cx({
			'request-list__buttons': true,
			'request-list__buttons--display': status === RequestStatuses.keys.active
		});
		const statusAddedClasses = cx({
			"icon-plus": true, 
			"request-list__status-added": true, 
			"request-list__status-added--display": status === RequestStatuses.keys.close});
		const statusRemovedClasses = cx({
			"icon-minus": true,
			"request-list__status-removed": true,
			"request-list__status-removed--display": status === RequestStatuses.keys.ignore});
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell table-list__body-cell--icon">
					<i className="icon-user"></i>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{position}</div>
				<div className="table-list__body-cell">{subdivision}</div>
				<div className="table-list__body-cell table-list__body-cell--10">
					<div className={buttonsClasses}>
						<button onClick={::this.handleCloseStatus} title="Утвердить заявку" className="event-btn request-list__add-button">
							<i className="icon-plus"></i>
						</button>
						<button onClick={::this.handleIgnoreStatus} title="Отклонить заявку" className="event-btn request-list__remove-button">
							<i className="icon-minus"></i>
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

	componentDidMount(){
		this._updateHeight();
	}

	componentDidUpdate(){
		this._updateHeight();
	}

	state = {
		isShowRejectReasonInfo: false,
		rejectRequestId: null,
		rejectRequestStatus: null
	}

	_updateHeight(){
		var height = ReactDOM.findDOMNode(this).clientHeight;
		var base = this.refs.base;
		var table = this.refs.table;
		table.style.height = (height - base.clientHeight - 20) + 'px';
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

	handleSort(e, payload){
		EventEditActions.requests.sortRequestTable(payload);
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
		const dateClasses = cx({
			'date': true,
			'date--display': this.props.isDateRequestBeforeBegin
		});
		const tableDescrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.requestItems.length === 0
		});
		const dropdownSortclasses = cx({
			'event-edit-requests__base-sort': true,
			'event-edit-requests__base-sort--display': this.props.requestItems.length > 0
		});
		return (
			<div className="event-edit-requests">
				<div ref="base" className="event-edit-requests__base">
					<div className="is-date-requests">
						<CheckBox 
							onChange={this.handleChangeIsDateRequestBeforeBegin} 
							label="Возможна подача заявок"
							checked={this.props.isDateRequestBeforeBegin}/>
						<div className={dateClasses}>
							<div className="alert alert--info is-date-requests__date-alert">
								<span>Обратите внимание, что дата начала и окончания подачи заявок не должна превышать дату начала мероприятия!</span>
							</div>
							<div className="date__start">
								<InputCalendar
									placeholder="C"
									className="date__calendar" 
									date={this.props.requestBeginDate} 
									onSave={this.handleChangeRequestBeginDate}/>
							</div>
							<div className="date__finish">
								<InputCalendar
									placeholder="По"
									className="date__calendar" 
									date={this.props.requestOverDate} 
									onSave={this.handleChangeRequestOverDate}/>
							</div>
						</div>
					</div>
					<br />
					<CheckBox 
						onChange={this.handleChangeIsAutomaticIncludeInCollaborators} 
						label="Автоматически включать в состав участников"
						checked={this.props.isAutomaticIncludeInCollaborators}/>
					<br />
					<br />
					<CheckBox 
						onChange={this.handleChangeIsApproveByBoss} 
						label="Необходимо подтверждение от непосредственного руководителя"
						checked={this.props.isApproveByBoss}/>
					<br />
					<br />
					<CheckBox 
						onChange={this.handleChangeIsApproveByTutor} 
						label="Необходимо подтверждение от ответственного за мероприятие"
						checked={this.props.isApproveByTutor}/>
					<br />
					<br />
					<DropDownIcon onChange={::this.handleSort} items={this.props.sortTypes} className={dropdownSortclasses}>
						<i className="icon-arrow-combo"></i>
					</DropDownIcon>
				</div>
				<div ref="table" className="table-list request-list">
					<span className={tableDescrClasses}>Нет заявок</span>
					<div className="table-list__table">
						<div className="table-list__header">
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