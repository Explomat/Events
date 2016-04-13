import React from 'react';
import './style/side-bar.scss';

class SideBar extends React.Component {
	
	constructor(props){
		super(props);
		this.handleSelectTab = this.handleSelectTab.bind(this);
	} 

	handleSelectTab(e){
		var target = e.target;
		if (this.props.onSelect) {
			this.props.onSelect({ key: target.getAttribute('data-name'), value: target.innerText });
		}
	}

	render(){
		return (
			<aside className="side-bar">
				<div className="side-bar__header">
					<i className="fa fa-angle-left backward-icon"></i>
					<span className="header-txt">Редактирование</span>
				</div>
				<div className="side-bar__body">
					<label className={"side-bar__tab-label " + (this.props.selectedTab === "base" ? "side-bar__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="base">Основные</label>
					<label className={"side-bar__tab-label " + (this.props.selectedTab === "requests" ? "side-bar__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="requests">Заявки</label>
					<label className={"side-bar__tab-label " + (this.props.selectedTab === "collaborators" ? "side-bar__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="collaborators">Участники</label>
					<label className={"side-bar__tab-label " + (this.props.selectedTab === "tutors" ? "side-bar__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="tutors">Ответственные</label>
					<label className={"side-bar__tab-label " + (this.props.selectedTab === "testing" ? "side-bar__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="testing">Тестирование</label>
					<label className={"side-bar__tab-label " + (this.props.selectedTab === "libraryMaterials" ? "side-bar__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="libraryMaterials">Материалы библиотеки</label>
					<label className={"side-bar__tab-label " + (this.props.selectedTab === "files" ? "side-bar__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="files">Файлы</label>
				</div>
			</aside>
		);
	}
};

export default SideBar;