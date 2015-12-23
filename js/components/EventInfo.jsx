var React = require('react');
var Hasher = require('../utils/Hasher');
var EventInfoStore = require('../stores/EventInfoStore');
var EventInfoActions = require('../actions/EventInfoActions');
var EventStatuses = require('../utils/event/EventStatuses');
var EventTypes = require('../utils/event/EventTypes');	
var DropDown = require('./modules/DropDown');
var FileTypes = require('../utils/event/FileTypes');

function getEventInfoState() {
	return EventInfoStore.getData();
}

var Collaborator = React.createClass({

	render: function() {
		return (
			<div className="event-item">
				<i className="event-item__icon fa fa-user"></i>
				<div className="event-wrapper">
					<a href={this.props.href} target="__blank" className="event-wrapper__fullname">{this.props.fullname}</a>
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
					<a href={this.props.href} target="__blank" className="event-wrapper__fullname">{this.props.fullname}</a>
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
					<a href={this.props.href} target="__blank" className="event-wrapper__fullname">{this.props.fullname}</a>
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
		return (
			<div className="file-item">
				<i className={"file-item__icon " + FileTypes.values[this.props.type]}></i>
				<div className="file-wrapper">
					<a href={this.props.href} className="file-wrapper__name">{this.props.name}</a>
				</div>
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

	getCollaboratorsMarkUp: function(){
		if (!this.props.collaborators) return null;
		var collaborators = this.props.collaborators.map(function(col, index){
			return <Collaborator key={index} {...col}/>
		});
		return <div className="collaborators">{collaborators}</div>;
	},

	getTutorsMarkUp: function(){
		if (!this.props.tutors) return null;
		var tutors = this.props.tutors.map(function(t, index){
			return <Tutor key={index} {...t}/>
		});
		return <div className="tutors">{tutors}</div>
	},

	getLectorsMarkUp: function(){
		if (!this.props.lectors) return null;
		var lectors = this.props.lectors.map(function(l, index){
			return <Lector key={index} {...l}/>
		});
		return <div className="lectors">{lectors}</div>
	},

	getFilesMarkUp: function(){
		if (!this.props.files) return null;
		var files = this.props.files.map(function(f, index){
			return <File key={index} {...f}/>
		});
		return <div className="files-body">{files}</div>;
	},

	render: function() {
		var collaborators = this.state.selectedPayload === 0 ? this.getCollaboratorsMarkUp() : null;
		var tutors = this.state.selectedPayload === 1 ? this.getTutorsMarkUp() : null;
		var lectors = this.state.selectedPayload === 2 ? this.getLectorsMarkUp() : null;
		var files = this.getFilesMarkUp();
		return (
			<div className="event-info__body-info">
				<div className="members">
					<DropDown onChange={this.handleChangeMembers} items={this.props.members} selectedPayload={this.state.selectedPayload} className={"members__dropdown"} classNameButton={"members__dropdown-button"}/>
					{collaborators}
					{tutors}
					{lectors}
				</div>
				<div className="files">
					<span className="files__label">Материалы для скачивания</span>
					{files}
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

	handleClose: function(){
		EventInfoStore.removeChangeListener(this._onChange);
		Hasher.setHash('calendar');
	},

	render: function(){
		var startDate = this.state.startDate.toLocaleDateString();
		var finishDate = this.state.finishDate.toLocaleDateString();
		var status = EventStatuses.values[this.state.status];
		var iconClass = this.state.type === EventTypes.keys.webinar ? 'fa fa-video-camera': 'fa fa-users';
		return(
			<div className="event-info-box">
				<section className="event-info">
					<button onClick={this.handleClose} className="close-btn">&times;</button>
					<i className={iconClass + " event-info__icon"}></i>
					<div className="event-info__main-info">
						<h1 className="event-info__name">{this.state.name}</h1>
						<p className="event-info__state">Статус : {status}</p>
						<p className="event-info__time">Дата проведения : {startDate} - {finishDate}</p>
						<p className="event-info__map">
							<span>Место проведения: {this.state.place}</span>
							<a href='#' className="event-info__map-link">Схема проезда</a>
						</p>
					</div>
					<EventInfoBody members={this.state.members} collaborators={this.state.collaborators} tutors={this.state.tutors} lectors={this.state.lectors} files={this.state.files}/>
					<div className="event-info__buttons">
						<button className="event-btn event-info__btn">Добавить отзыв</button>
						<button className="event-btn event-info__btn">Скачать запись</button>
					</div>
				</section>
			</div>
		);
	}
});

module.exports = EventInfo;