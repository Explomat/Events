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

import Hasher from '../../../utils/Hasher';
import EventEditStore from '../../../stores/EventEditStore';
import CheckBox from '../../modules/checkbox';
import InputCalendar from '../../modules/input-calendar';
import SelectItems from '../../modules/select-items';

import Config from '../../../config';
import {merge} from 'lodash';



function getEventEditState() {
	return EventEditStore.getData();
}

class EventEdit extends React.Component{

	constructor(props){
		super(props);
		this.sideBarComponents = {'Base': Base, 'Requests': Requests, 'Collaborators': Collaborators, 'Tutors': Tutors, 'Testing': Testing, 'Courses': Courses, 'LibraryMaterials': LibraryMaterials, 'Files': Files};
		this._onChange = this._onChange.bind(this);
		this.getTabView = this.getTabView.bind(this);
		this.getModal = this.getModal.bind(this);
		this.handleSelectTab = this.handleSelectTab.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleSaveItems = this.handleSaveItems.bind(this);
	}

	state =  merge(getEventEditState(), {
		selectedTab: { key: 'Base', value: 'Основные' },
		isShowModal: false
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
		return Component ? <Component /> : null;
	}

	getModal(){
		return this.state.isShowModal ? <SelectItems
											title={"Test"}
											maxSelectedItems={1}
											query={Config.url.createPath({action_name: 'getCollaborators'})}
											onClose={this.handleCloseModal} 
											onSave={this.handleSaveItems}/> : null;
	}

	handleSelectTab(tabName){
		this.setState({selectedTab: tabName})
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

	handleShowModal(){
		this.setState({isShowModal: true});
	}

	handleSaveItems(items){
		this.setState({isShowModal: false});
	}

	render(){
		var tabView = this.getTabView(this.state.selectedTab.key);
		var modal = this.getModal();
		return(
			<div className="container">
				<SideBar onSelect={this.handleSelectTab} selectedTab={this.state.selectedTab.key}/>
				<div className="calendar">
					<header className ="calendar-header">
						<span>{this.state.selectedTab.value}</span>
					</header>
					{tabView}
					{modal}
					<button onClick={this.handleShowModal}>Open modal</button>
				</div>
			</div>
		);
	}
};

export default EventEdit;