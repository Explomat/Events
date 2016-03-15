import React from 'react';

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
			<aside className="side-mnu">
				<div className="side-mnu__header">
					<i className="fa fa-angle-left backward-icon"></i>
					<span className="header-txt">Редактирование</span>
				</div>
				<div className="side-mnu__body">
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Base" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Base">Основные</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Requests" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Requests">Заявки</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Collaborators" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Collaborators">Участники</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Tutors" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Tutors">Ответственные</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Testing" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Testing">Тестирование</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Courses" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Courses">Электронные курсы</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "LibraryMaterials" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="LibraryMaterials">Материалы библиотеки</label>
					<label className={"side-mnu__tab-label " + (this.props.selectedTab === "Files" ? "side-mnu__tab-label--selected": "") } onClick={this.handleSelectTab} data-name="Files">Файлы</label>
				</div>
			</aside>
		);
	}
};

export default SideBar;