var React = require('react');
var Hasher = require('../utils/Hasher');
var EventInfoStore = require('../stores/EventInfoStore');
var EventInfoActions = require('../actions/EventInfoActions');
var EventStatuses = require('../utils/event/EventStatuses');
var EventTypes = require('../utils/event/EventTypes');	
var DropDown = require('./modules/DropDown');
var FileTypes = require('../utils/event/FileTypes');
var DateUtils = require('../utils/event/DateUtils');

function getEventInfoState() {
	return EventInfoStore.getData();
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
		EventInfoStore.removeChangeListener(this._onChange);
	},

	_onChange: function() {
		this.setState(getEventInfoState());
	},

	getInitialState: function () {
		return getEventInfoState();
	},

	getDateTime: function(){
		return DateUtils.getDateTime(this.state.startDate) + ' - ' + DateUtils.getDateTime(this.state.finishDate);
	},

	getButtons: function(){
		var buttons = [];
		var status = this.state.status;
		var type = this.state.type;
		var isWebinar = type === EventTypes.keys.webinar;
		var index = 0;
		if (isWebinar){
			var webinarInfo = EventInfoStore.getWebinarInfo();
			if (EventInfoStore.isUserInEvent()){
				buttons.push(<button key={index} className="event-btn event-info__btn">Отказаться от участия</button>);
				index++;
			}
			if (status === EventStatuses.keys.active) {
				buttons.push(<button key={index} className="event-btn event-info__btn">Войти в вебинар</button>);
			}
			else if (status === EventStatuses.keys.close) {
				buttons.push(<button key={index} className="event-btn event-info__btn">Добавить отзыв</button>);
				index++;
				if (webinarInfo) {
					buttons.push(<button key={index} className="event-btn event-info__btn">Посмотеть запись</button>);
					index++;
				}
			}
		}
		else {
			if (EventInfoStore.isUserInEvent()){
				buttons.push(<button key={index} className="event-btn event-info__btn">Отказаться от участия</button>);
				index++;
			}
			if (status === EventStatuses.keys.plan) {
				buttons.push(<button key={index} className="event-btn event-info__btn">Подать заявку</button>);
				index++;
			}
			else if (status === EventStatuses.keys.close){
				buttons.push(<button key={index} className="event-btn event-info__btn">Добавить отзыв</button>);
			}
		}
		return buttons;
	},

	handleClose: function(){
		EventInfoStore.removeChangeListener(this._onChange);
		Hasher.setHash('calendar');
	},

	render: function(){
		var isWebinar = this.state.type === EventTypes.keys.webinar;
		var dateTime = this.getDateTime();
		var status = EventStatuses.values[this.state.status];
		var iconClass = this.state.type === EventTypes.keys.webinar ? 'icon--type--webinar': 'icon--type--fulltime';
		var isDisplayPlaceClass = isWebinar ? 'event-info__map--hide': '';
		var buttons = this.getButtons();
		return(
			<div className="event-info-box">
				<section className="event-info">
					<button onClick={this.handleClose} className="close-btn">&times;</button>
					<i className={"icon icon--big "+iconClass+" event-info__icon"}></i>
					<div className="event-info__main-info">
						<h1 className="event-info__name">{this.state.name}</h1>
						<p className="event-info__state">Статус : {status}</p>
						<p className="event-info__time">Дата проведения : {dateTime}</p>
						<p className={"event-info__map " + isDisplayPlaceClass}>
							<span>Место проведения: {this.state.place}</span><br/>
							<a href='#' className="event-info__map-link"> Схема проезда</a>
						</p>
					</div>
					<EventInfoBody members={this.state.members} collaborators={this.state.collaborators} tutors={this.state.tutors} lectors={this.state.lectors} files={this.state.files}/>
					<div className="event-info__buttons">
						{buttons}
					</div>
				</section>
			</div>
		);
	}
});

module.exports = EventInfo;