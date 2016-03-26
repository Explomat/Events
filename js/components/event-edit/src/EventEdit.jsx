import React from 'react';

import SideBar from './SideBar';
import Base from './tabs/Base';
import Collaborators from './tabs/Collaborators';
import Files from './tabs/Files';
import LibraryMaterials from './tabs/LibraryMaterials';
import Requests from './tabs/Requests';
import Testing from './tabs/Testing';
import Courses from './tabs/Courses';
import Tutors from './tabs/Tutors';

//import Hasher from '../../../utils/Hasher';
import EventEditStore from '../../../stores/EventEditStore';
import {merge} from 'lodash';

import './style/event-edit.scss';

function getEventEditState() {
	return EventEditStore.getData();
}

class EventEdit extends React.Component{

	constructor(props){
		super(props);
		this.sideBarComponents = {'Base': Base, 'Requests': Requests, 'Collaborators': Collaborators, 'Tutors': Tutors, 'Testing': Testing, 'Courses': Courses, 'LibraryMaterials': LibraryMaterials, 'Files': Files};
		this._onChange = this._onChange.bind(this);
		this.getTabView = this.getTabView.bind(this);
		this.handleSelectTab = this.handleSelectTab.bind(this);
	}

	state =  merge(getEventEditState(), {
		selectedTab: { key: 'Base', value: 'Основные' }
	})

	componentDidMount() {
		EventEditStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		EventEditStore.removeChangeListener(this._onChange);
	}

	_onChange() {
		this.setState(getEventEditState());
	}

	getTabView(tabName){
		var Component = this.sideBarComponents[tabName];
		return Component ? <Component {...this.state}/> : null;
	}

	handleSelectTab(tabName){
		this.setState({selectedTab: tabName})
	}

	render(){
		var tabView = this.getTabView(this.state.selectedTab.key);
		return(
			<div className="container">
				<SideBar onSelect={this.handleSelectTab} selectedTab={this.state.selectedTab.key}/>
				<div className="calendar">
					<header className ="calendar-header">
						<span>{this.state.selectedTab.value}</span>
					</header>
					<div className="event-edit-container">
						<div className="event-edit">
							{tabView}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default EventEdit;