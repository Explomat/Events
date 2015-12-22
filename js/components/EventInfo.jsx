var React = require('react');
var Hasher = require('../utils/Hasher');
var EventInfoStore = require('../stores/EventInfoStore');
var EventInfoActions = require('../actions/EventInfoActions');
var EventStatuses = require('../utils/event/EventStatuses');
var EventTypes = require('../utils/event/EventTypes');	

function getEventInfoState() {
	return EventInfoStore.getData();
}

var Collaborators = React.createClass({

	propTypes: {
		collaborators: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array])
	},

	render: function() {
		return (
			<div>

			</div>
		);
	}
});

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
					<button onClick={this.handleClose} className="close-btn">x</button>
					<i className={iconClass + " event-info__icon"}></i>
					<div className="event-info__main-info">
						<h1 className="event-info__name">{this.state.name}</h1>
						<p className="event-info__state">Статус : {status}</p>
						<p className="event-info__time">Дата проведения : {startDate} - {finishDate} </p>
						<p className="event-info__map">
							<span>{this.state.place}</span>
							<a href='' className="event-info__map-link">Схема проезда</a>
						</p>
					</div>
					<div className="event-info__members">
						<span className="event-info__members-label">Участники</span>
						<div className="event-info__members-body">dfs</div>
					</div>
					<div className="event-info__files">
						<span className="event-info__files-label">Материалы для скачивания</span>
						<div className="event-info__files-body"></div>
					</div>
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