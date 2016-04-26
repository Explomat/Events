import React from 'react';
import LiveSearch from 'components/modules/live-search';
import EventNewActions from 'actions/EventNewActions';
import EventNewStore from 'stores/EventNewStore';
import Base from './tabs/Base';
import DateComponent from './tabs/Date';
import Place from './tabs/Place';
import {merge} from 'lodash';

import './style/event-new.scss';

function getEventNewState() {
	return EventNewStore.getData();
}

class EventNew extends React.Component {

	constructor(props){
		super(props);
		this.tabComponents = {'base': Base, 'date': DateComponent, 'place': Place};
	}

	state = merge(getEventNewState(), {
		selectedTab: { key: 'base', value: 'Основные' }
	});

	_prepareCollaborators(items){
		return items.map((i) => {
			return {
				payload: i.id,
				value: i.fullname,
				description: i.description
			}
		});
	}

	_getTabView(tabName){
		var partialState = EventNewStore.getPartialData(tabName);
		var Component = this.tabComponents[tabName];
		return Component ? <Component {...partialState}/> : null;
	}

	componentDidMount() {
		EventNewStore.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
		EventNewStore.removeChangeListener(this._onChange.bind(this));
	}

	_onChange() {
		this.setState(getEventNewState());
	}

	handleChange(val){
		EventNewActions.getCollaborators(val);
	}

	handleSelect(payload){
		EventNewActions.selectCollaborator(payload);
	}

	render(){
		const collaborators = this._prepareCollaborators(this.state.collaborators);
		var tabView = this._getTabView(this.state.selectedTab.key);
		return (
			<div className="event-new">
				<div className="event-new__modal-box">
					<div className="event-new__content">
						<div className="event-new__header">
							<div className="event-new__title-banner">Создание мероприятия</div>
							<span>&nbsp;</span>
							<button type="button" className="close-btn" onClick={this.handleClose}>&times;</button>
						</div>
						<div className="event-new__body clearfix">
							<div className="event-new__tabs">
								<div className="event-new__tab">
									<i className="icon-cog event-new__tab-icon"></i>
									<p className="event-new__tab-name">Основное</p>
								</div>
								<div className="event-new__tab">
									<i className="icon-calendar event-new__tab-icon"></i>
									<p className="event-new__tab-name">Дата и время</p>
								</div>
								<div className="event-new__tab">
									<i className="icon-map-marker event-new__tab-icon"></i>
									<p className="event-new__tab-name">Расположение</p>
								</div>
								<div className="event-new__tab">
									<i className="icon-user event-new__tab-icon"></i>
									<p className="event-new__tab-name">Преподаватель</p>
								</div>
								<div className="event-new__tab">
									<i className="icon-bullhorn event-new__tab-icon"></i>
									<p className="event-new__tab-name">Организатор</p>
								</div>
								<div className="event-new__tab">
									<i className="icon-cogs event-new__tab-icon"></i>
									<p className="event-new__tab-name">Дополнительно</p>
								</div>
							</div>
							<div className="event-new__tabview">{tabView}</div>
							<LiveSearch
								onChange={this.handleChange}
								onSelect={this.handleSelect}
								items={collaborators}/>
						</div>
						<div className="event-new__footer">
							<button type="button" className="event-btn event-btn--reverse" onClick={this.handleSave}>Сохранить</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default EventNew;