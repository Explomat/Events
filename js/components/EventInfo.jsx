var React = require('react');
var Hasher = require('../utils/Hasher');
var EventInfoStore = require('../stores/EventInfoStore');
var CalendarStore = require('../stores/CalendarStore');
var EventInfoActions = require('../actions/EventInfoActions');
var EventStatuses = require('../utils/event/EventStatuses');
var EventTypes = require('../utils/event/EventTypes');	
var DropDown = require('./modules/DropDown');
var TextOverflow = require('./modules/TextOverflow');
var FileTypes = require('../utils/event/FileTypes');
var DateUtils = require('../utils/event/DateUtils');

function getEventInfoState() {
	return {
		event: EventInfoStore.getData(),
		error: EventInfoStore.getError(),
		info: EventInfoStore.getInfo()
	}
}

var Collaborator = React.createClass({

	render: function() {
		return (
			<div className="event-item">
				<i className="event-item__icon fa fa-user"></i>
				<div className="event-wrapper">
					<a href={this.props.href} title={this.props.fullname} target="__blank" className="event-wrapper__fullname">{this.props.fullname}</a>
				</div>
			</div>
		);
	}
});

var Tutor = React.createClass({

	render: function() {
		return (
			<div className="event-item">
				<i className="event-item__icon fa fa-user"></i>
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
});

var Lector = React.createClass({

	render: function() {
		return (
			<div className="event-item">
				<i className="event-item__icon fa fa-user"></i>
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
});

var File = React.createClass({

	render: function() {
		var fileTypeClass = FileTypes.values[this.props.type] || FileTypes.values.unknown;
		return (
			<div className="file-item">
				<i className={"icon "+ fileTypeClass +" file-item__icon"}></i>
				<a href={this.props.href} title={this.props.name} className="file-item__name">{this.props.name}</a>
			</div>
		);
	}
});

var EventInfoBody = React.createClass({

	propTypes: {
		members: React.PropTypes.array.isRequired,
		collaborators: React.PropTypes.array,
		tutors: React.PropTypes.array,
		lectors: React.PropTypes.array,
		files: React.PropTypes.array
	},

	getInitialState: function(){
		return {
			selectedPayload: this.props.members[0].payload
		}
	},

	handleChangeMembers: function(e, payload, text, index){
		this.setState({selectedPayload: payload});
	},

	getCollaborators: function(){
		if (!this.props.collaborators) return null;
		return this.props.collaborators.map(function(col, index){
			return <Collaborator key={index} {...col}/>
		});
	},

	getTutors: function(){
		if (!this.props.tutors) return null;
		return this.props.tutors.map(function(t, index){
			return <Tutor key={index} {...t}/>
		});
	},

	getLectors: function(){
		if (!this.props.lectors) return null;
		return this.props.lectors.map(function(l, index){
			return <Lector key={index} {...l}/>
		});
	},

	getFiles: function(){
		if (!this.props.files) return null;
		return this.props.files.map(function(f, index){
			return <File key={index} {...f}/>
		});
	},

	getMembersMarkUp: function(collaborators, tutors, lectors){
		return <div className="items">{collaborators || tutors || lectors}</div>
	},

	render: function() {
		var collaborators = this.state.selectedPayload === 0 ? this.getCollaborators() : null;
		var tutors = this.state.selectedPayload === 1 ? this.getTutors() : null;
		var lectors = this.state.selectedPayload === 2 ? this.getLectors() : null;
		var membersMarkUp = this.getMembersMarkUp(collaborators, tutors, lectors);
		var membersCount = (collaborators || tutors || lectors).length;
		var files = this.getFiles();
		return (
			<div className="event-info__body-info">
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
})

var EventInfo = React.createClass({

	componentDidMount: function() {
		EventInfoStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function() {
		EventInfoActions.disposeData();
		EventInfoStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getEventInfoState());
	},

	getInitialState: function () {
		return getEventInfoState();
	},

	getDateTime: function(){
		return DateUtils.getDateTime(this.state.event.startDate) + ' - ' + DateUtils.getDateTime(this.state.event.finishDate);
	},

	handleCreateRequest: function(){
		EventInfoActions.createRequest(this.state.event.id);
	},

	handleRemoveCollaborator: function(){
		EventInfoActions.removeCollaborator(this.state.event.id, CalendarStore.getUserId());
	},

	getButtons: function(){
		var buttons = [];
		var status = this.state.event.status;
		var type = this.state.event.type;
		var userId = CalendarStore.getUserId();
		var isWebinar = type === EventTypes.keys.webinar;
		var isUserInEvent = EventInfoStore.isUserInEvent(userId);
		var index = 0;

		if (isUserInEvent){
			if (status === EventStatuses.keys.close)
				buttons.push(<a key={index} className="event-btn event-info__btn" target="__blank" href={this.state.event.reportHref}>Добавить отзыв</a>);
			else if (status === EventStatuses.keys.plan) {
				buttons.push(<button onClick={this.handleRemoveCollaborator} key={index} className="event-btn event-info__btn">Отказаться от участия</button>);
			}
		}
		else {
			if (status === EventStatuses.keys.plan) {
				buttons.push(<button onClick={this.handleCreateRequest} key={index} className="event-btn event-info__btn">Подать заявку</button>);
			}
		}

		if (isWebinar){
			var webinarInfo = EventInfoStore.getWebinarInfo();
			if (webinarInfo && isUserInEvent) {
				if (status === EventStatuses.keys.active) {
					buttons.push(<a key={index} className="event-btn event-info__btn" target="__blank" href={webinarInfo.enterHref}>Войти в вебинар</a>);
				}
				index++;
			}
			if (webinarInfo && status === EventStatuses.keys.close) {
				buttons.push(<a key={index} className="event-btn event-info__btn" target="__blank" href={webinarInfo.href}>Посмотреть запись</a>);
			}
		}
		return buttons;
	},

	handleClose: function(){
		EventInfoActions.disposeData();
		EventInfoStore.removeChangeListener(this._onChange);
		Hasher.setHash('calendar');
	},

	handleCloseError: function(){
		EventInfoActions.clearError();
	},

	handleCloseInfo: function(){
		EventInfoActions.clearInfo();
	},

	render: function(){
		var isWebinar = this.state.event.type === EventTypes.keys.webinar;
		var dateTime = this.getDateTime();
		var status = EventStatuses.values[this.state.event.status];
		var iconClass = this.state.event.type === EventTypes.keys.webinar ? 'icon--type--webinar': 'icon--type--fulltime';
		var isDisplayPlaceClass = isWebinar ? 'event-info__map--hide': '';
		var buttons = this.getButtons();
		var errorClass = this.state.error ? 'error-block--show' : '';
		var infoClass = this.state.info ? 'info-block--show' : '';
		return(
			<div className="event-info-box">
				<section className="event-info">
					<div className="event-info__header">
						<button onClick={this.handleClose} className="close-btn">&times;</button>
					</div>
					<div className="event-info__body">
						<i className={"icon icon--big "+iconClass+" event-info__icon"}></i>
						<div className="event-info__main-info">
							<TextOverflow className={"event-info__name"} value={this.state.event.name} rowsCount={3} />
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
						<div className={"error-block " + errorClass}>
							<button onClick={this.handleCloseError} className="close-btn">&times;</button>
							<span>{this.state.error}</span>
						</div>
						<div className={"info-block " + infoClass}>
							<button onClick={this.handleCloseInfo} className="close-btn">&times;</button>
							<span>{this.state.info}</span>
						</div>
						<div className="event-info__buttons">
							{buttons}
						</div>
					</div>
				</section>
			</div>
		);
	}
});

module.exports = EventInfo;