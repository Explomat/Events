import React from 'react';
import Hasher from '../utils/Hasher';
import EventInfoStore from '../stores/EventInfoStore';
import CalendarStore from '../stores/CalendarStore';
import EventInfoActions from '../actions/EventInfoActions';
import EventStatuses from '../utils/event/EventStatuses';
import EventTypes from '../utils/event/EventTypes';
import DropDown from './modules/dropdown';
import TextOverflow from './modules/text-overflow';
import FileTypes from '../utils/event/FileTypes';
import DateUtils from '../utils/event/DateUtils';

function getEventInfoState() {
	return {
		event: EventInfoStore.getData(),
		info: EventInfoStore.getInfo()
	}
}

class Collaborator extends React.Component { 	
	render() {
		return (
			<div className="event-item">
				<div className="event-item__icon">
					<img className="event-item__icon-img" src={this.props.imgHref} />
				</div>
				<div className="event-wrapper">
					<a href={this.props.href} title={this.props.fullname} target="__blank" className="event-wrapper__fullname">{this.props.fullname}</a>
				</div>
			</div>
		);
	}
};

class Tutor extends React.Component {
	render() {
		return (
			<div className="event-item">
				<div className="event-item__icon">
					<img className="event-item__icon-img" src={this.props.imgHref} />
				</div>
				<div className="event-wrapper">
					<a href={this.props.href} title={this.props.fullname} target="__blank" className="event-wrapper__fullname">{this.props.fullname}</a>
					<i className="event-wrapper__phone-icon fa fa-phone"></i>
					<span className="event-wrapper__phone">{this.props.phone}</span>
					<i className="event-wrapper__mail-icon fa fa-envelope"></i>
					<span className="event-wrapper__mail">{this.props.email}</span>
				</div>
			</div>
		);
	}
};

class Lector extends React.Component {
	render() {
		return (
			<div className="event-item">
				<div className="event-item__icon">
					<img className="event-item__icon-img" src={this.props.imgHref} />
				</div>
				<div className="event-wrapper">
					<a href={this.props.href} title={this.props.fullname} target="__blank" className="event-wrapper__fullname">{this.props.fullname}</a>
					<i className="event-wrapper__phone-icon fa fa-phone"></i>
					<span className="event-wrapper__phone">{this.props.phone}</span>
					<i className="event-wrapper__mail-icon fa fa-envelope"></i>
					<span className="event-wrapper__mail">{this.props.email}</span>
				</div>
			</div>
		);
	}
};

class File extends React.Component {
	render() {
		var fileTypeClass = FileTypes.values[this.props.type] || FileTypes.values.unknown;
		return (
			<div className="file-item">
				<i className={"icon "+ fileTypeClass +" file-item__icon"}></i>
				<a href={this.props.href} title={this.props.name} className="file-item__name">{this.props.name}</a>
			</div>
		);
	}
};

class EventInfoBody extends React.Component {

	constructor(props){
		super(props);
		this.handleChangeMembers = this.handleChangeMembers.bind(this);
	}

	static propTypes = {
		members: React.PropTypes.array.isRequired,
		collaborators: React.PropTypes.array,
		tutors: React.PropTypes.array,
		lectors: React.PropTypes.array,
		files: React.PropTypes.array
	}

	state = {
		selectedPayload: this.props.members[0].payload
	}

	handleChangeMembers(e, payload, text, index){
		this.setState({selectedPayload: payload});
	}

	getCollaborators(){
		if (!this.props.collaborators) return null;
		return this.props.collaborators.map((col, index) => {
			return <Collaborator key={index} {...col}/>
		});
	}

	getTutors(){
		if (!this.props.tutors) return null;
		return this.props.tutors.map((t, index) => {
			return <Tutor key={index} {...t}/>
		});
	}

	getLectors(){
		if (!this.props.lectors) return null;
		return this.props.lectors.map((l, index) => {
			return <Lector key={index} {...l}/>
		});
	}

	getFiles(){
		if (!this.props.files) return null;
		return this.props.files.map((f, index) => {
			return <File key={index} {...f}/>
		});
	}

	getMembersMarkUp(collaborators, tutors, lectors){
		return <div className="items">{collaborators || tutors || lectors}</div>
	}

	render() {
		var collaborators = this.state.selectedPayload === 0 ? this.getCollaborators() : null;
		var tutors = this.state.selectedPayload === 1 ? this.getTutors() : null;
		var lectors = this.state.selectedPayload === 2 ? this.getLectors() : null;
		var membersMarkUp = this.getMembersMarkUp(collaborators, tutors, lectors);
		var membersCount = (collaborators || tutors || lectors).length;
		var files = this.getFiles();
		return (
			<div className="event-info__body-info clearfix">
				<div className="members">
					<DropDown onChange={this.handleChangeMembers} items={this.props.members} selectedPayload={this.state.selectedPayload} className={"members__dropdown"} classNameButton={"members__dropdown-button"}/>
					<span className="members__count">({membersCount})</span>
					{membersMarkUp}
				</div>
				<div className="files">
					<span className="files__label">Материалы для скачивания</span>
					<div className="files-body">{files}</div>
				</div>
			</div>
		);
	}
};

class EventInfo extends React.Component {

	constructor(props){
		super(props);
		this.handleClose = this.handleClose.bind(this);
		this.handleCreateRequest = this.handleCreateRequest.bind(this);
		this.handleRemoveCollaborator = this.handleRemoveCollaborator.bind(this);
		this.handleStartEvent = this.handleStartEvent.bind(this);
		this.handleFinishEvent = this.handleFinishEvent.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount() {
		EventInfoStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		EventInfoActions.disposeData();
		EventInfoStore.removeChangeListener(this._onChange);
	}

	_onChange() {
		this.setState(getEventInfoState());
	}

	state = getEventInfoState()

	getDateTime(){
		return DateUtils.getDateTime(this.state.event.startDate) + ' - ' + DateUtils.getDateTime(this.state.event.finishDate);
	}

	handleCreateRequest(){
		EventInfoActions.createRequest(this.state.event.id);
	}

	handleRemoveCollaborator(){
		EventInfoActions.removeCollaborator(this.state.event.id, CalendarStore.getUserId());
	}

	handleStartEvent(){
		EventInfoActions.startEvent(this.state.event.id);
	}

	handleFinishEvent(){
		EventInfoActions.finishEvent(this.state.event.id);
	}

	getButtons(){
		var buttons = [];
		var status = this.state.event.status;
		var type = this.state.event.type;
		var userId = CalendarStore.getUserId();
		var isWebinar = type === EventTypes.keys.webinar;
		var isUserInEvent = EventInfoStore.isUserInEvent(userId);

		var isUserInCollaborators = EventInfoStore.isUserInCollaborators(userId);
		var isUserInTutors = EventInfoStore.isUserInTutors(userId);
		var isUserInLectors = EventInfoStore.isUserInLectors(userId);
		var index = 0;

		if (isUserInEvent){
			if (status === EventStatuses.keys.close){
				buttons.push(<a key={index} className="event-btn event-info__btn" target="__blank" href={this.state.event.reportHref}>Добавить отзыв</a>);
				index++;
			}
			else if (status === EventStatuses.keys.plan && isUserInCollaborators) {
				buttons.push(<button onClick={this.handleRemoveCollaborator} key={index} className="event-btn event-info__btn">Отказаться от участия</button>);
				index++;
			}
			else if (status === EventStatuses.keys.plan && (isUserInTutors || isUserInLectors)) {
				buttons.push(<button onClick={this.handleStartEvent} key={index} className="event-btn event-info__btn event-info__buttons-start">Начать мероприятие</button>);
				index++;
			}
			else if (status === EventStatuses.keys.active && (isUserInTutors || isUserInLectors)) {
				buttons.push(<button onClick={this.handleFinishEvent} key={index} className="event-btn event-info__btn event-info__buttons-finish">Завершить мероприятие</button>);
				index++;
			}
		}
		else {
			if (status === EventStatuses.keys.plan) {
				buttons.push(<button onClick={this.handleCreateRequest} key={index} className="event-btn event-info__btn">Подать заявку</button>);
				index++;
			}
		}

		if (isWebinar){
			var webinarInfo = EventInfoStore.getWebinarInfo();
			if (webinarInfo && isUserInEvent) {
				if (status === EventStatuses.keys.active) {
					buttons.push(<a key={index} className="event-btn event-info__btn" target="__blank" href={webinarInfo.enterHref}>Войти в вебинар</a>);
					index++;
				}
			}
			if (webinarInfo && webinarInfo.href && status === EventStatuses.keys.close) {
				buttons.push(<a key={index} className="event-btn event-info__btn" target="__blank" href={webinarInfo.href}>Посмотреть запись</a>);
			}
		}
		return buttons;
	}

	handleClose(){
		EventInfoActions.disposeData();
		EventInfoStore.removeChangeListener(this._onChange);
		Hasher.setHash('calendar');
	}

	handleCloseInfo(){
		EventInfoActions.clearInfo();
	}

	render(){
		var isWebinar = this.state.event.type === EventTypes.keys.webinar;
		var dateTime = this.getDateTime();
		var status = EventStatuses.values[this.state.event.status];
		var iconClass = this.state.event.type === EventTypes.keys.webinar ? 'icon--type--webinar': 'icon--type--fulltime';
		var isDisplayPlaceClass = isWebinar ? 'event-info__map--hide': '';
		var buttons = this.getButtons();
		var infoClass = this.state.info ? 'event-info__info-block--show' : '';
		return(
			<div className="event-info-box">
				<section className="event-info">
					<div className="event-info__header">
						<button onClick={this.handleClose} className="close-btn">&times;</button>
					</div>
					<div className="event-info__body">
						<i className={"icon icon--big "+iconClass+" event-info__icon"}></i>
						<div className="event-info__main-info">
							<TextOverflow className={"event-info__name"} value={this.state.event.name} rowsCount={2} />
							<p className="event-info__state">Статус : {status}</p>
							<p className="event-info__time">Дата проведения : {dateTime}</p>
							<p className={"event-info__map " + isDisplayPlaceClass}>
								<span>Место проведения: {this.state.event.place}</span><br/>
								<a href='#' className="event-info__map-link"> Схема проезда</a>
							</p>
						</div>
						<EventInfoBody members={this.state.event.members} collaborators={this.state.event.collaborators} tutors={this.state.event.tutors} lectors={this.state.event.lectors} files={this.state.event.files}/>
					</div>
					<div className="event-info__footer">
						<div className={"event-info__info-block " + infoClass}>
							<button onClick={this.handleCloseInfo} className="close-btn">&times;</button>
							<TextOverflow value={this.state.info} rowsCount={2} />
						</div>
						<div className="event-info__buttons">
							{buttons}
						</div>
					</div>
				</section>
			</div>
		);
	}
};
export default EventInfo;