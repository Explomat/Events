import React from 'react';
import EventNewStore from 'stores/EventNewStore';
import Base from './tabs/Base';
import PlaceAndDatetime from './tabs/PlaceAndDatetime';
import Tutors from './tabs/Tutors';
import {merge} from 'lodash';
import cx from 'classnames';

import './style/event-new.scss';

function getEventNewState() {
	return EventNewStore.getData();
}

class EventNew extends React.Component {

	constructor(props){
		super(props);
		this.tabComponents = {'base': Base, 'placeAndDateTime': PlaceAndDatetime, 'tutors': Tutors};
	}

	state = merge(getEventNewState(), {
		selectedTab: 'base'
	});

	_getTabView(tabName){
		var partialState = EventNewStore.getPartialData(tabName);
		var Component = this.tabComponents[tabName];
		return Component ? <Component {...partialState}/> : null;
	}

	_getPrevTabName(selectedTab){
		var keys = Object.keys(this.tabComponents);
		for (var i = keys.length - 1; i > 0; i--) {
			let key = keys[i];
			if (key === selectedTab) {
				return keys[i - 1];
			}
		};
		return null;
	}

	_getNextTabName(selectedTab){
		var keys = Object.keys(this.tabComponents);
		for (let i = 0; i < keys.length - 1; i++){
			let key = keys[i];
			if (key === selectedTab) {
				return keys[i + 1];
			}
		}
		return null;
	}

	_isFirstTab(selectedTab){
		var keys = Object.keys(this.tabComponents);
		var firstTab = keys[0];

		if (firstTab && firstTab === selectedTab) {
			return true;
		}
		return false;
	}

	_isLastTab(selectedTab){
		var keys = Object.keys(this.tabComponents);
		var lastTab = keys[keys.length - 1];

		if (lastTab && lastTab === selectedTab) {
			return true;
		}
		return false;
	}

	_getClasses(tabName){
		return cx({
			'event-new__tab': true,
			'event-new__tab--selected': this.state.selectedTab === tabName
		});
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

	handleSelectTab(e){
		var target = e.currentTarget;
		this.setState({selectedTab: target.getAttribute('data-name')});
	}

	handlePrevClick(){
		var nextTab = this._getPrevTabName(this.state.selectedTab);
		this.setState({ selectedTab: nextTab });
	}

	handleNextClick(){
		var nextTab = this._getNextTabName(this.state.selectedTab);
		this.setState({ selectedTab: nextTab });
	}

	render(){
		var tabView = this._getTabView(this.state.selectedTab);
		const baseClasses = this._getClasses('base');
		const datetimeClasses = this._getClasses('placeAndDateTime');
		const tutorsClasses = this._getClasses('tutors');

		const isFirstTabSelected = this._isFirstTab(this.state.selectedTab);
		const isLastTabSelected = this._isLastTab(this.state.selectedTab);

		const isAllFieldsFilled = EventNewStore.isAllFieldsFilled(this.state.selectedTab);

		const prevButtonClasses = cx({
			'event-btn': true,
			'event-btn--reverse': true,
			'event-new__prev-button': true,
			'event-new__prev-button--display': !isFirstTabSelected
			
		});
		const nextButtonClasses = cx({
			'event-btn': true,
			'event-btn--reverse': true,
			'event-btn--disabled': isLastTabSelected || !isAllFieldsFilled,
			'event-new__next-button': true
		});
		
		return (
			<div className="event-new">
				<div className="event-new__modal-box">
					<div className="event-new__content">
						<div className="event-new__header">
							<div className="event-new__title-banner">Создание мероприятия</div>
							<button type="button" className="close-btn" onClick={this.handleClose}>&times;</button>
						</div>
						<div className="event-new__body clearfix">
							<div className="event-new__tabs clearfix">
								<div onClick={::this.handleSelectTab} className={baseClasses} data-name="base">
									<i className="icon-cog event-new__tab-icon"></i>
									<p className="event-new__tab-name">Основные</p>
								</div>
								<div onClick={::this.handleSelectTab} className={datetimeClasses} data-name="placeAndDateTime">
									<i className="icon-map-marker event-new__tab-icon"></i>
									<span className="event-new__devider">&</span>
									<i className="icon-calendar event-new__tab-icon event-new__tab-icon--calendar"></i>
									<p className="event-new__tab-name">Расположение</p>
									<span className="event-new__tab-name">Дата и время</span>
								</div>
								<div onClick={::this.handleSelectTab} className={tutorsClasses} data-name="tutors">
									<i className="icon-user event-new__tab-icon"></i>
									<p className="event-new__tab-name">Преподаватель</p>
								</div>
							</div>
							<div className="event-new__tabview">{tabView}</div>
						</div>
						<div className="event-new__footer">
							<button type="button" className={prevButtonClasses} onClick={::this.handlePrevClick}>
								<i className="icon-left-open-big event-new__icon-prev"></i>
								<strong>Назад</strong>
							</button>
							<button type="button" className={nextButtonClasses} disabled={isLastTabSelected} onClick={::this.handleNextClick}>
								<strong>Далее</strong>
								<i className="icon-right-open-big event-new__icon-next"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default EventNew;