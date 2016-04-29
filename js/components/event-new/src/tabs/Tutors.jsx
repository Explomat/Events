import React from 'react';
import { ButtonTabs, ButtonTab } from 'components/modules/button-tabs';
import {TextView} from 'components/modules/text-label';
import LiveSearch from 'components/modules/live-search';
import LectorTypes from 'utils/eventedit/LectorTypes';

import EventNewActions from 'actions/EventNewActions';
import cx from 'classnames';

import config from 'config';

const LectorNewTypes = {
	keys: {
		select: 'select',
		add: 'add'
	},
	values: {
		select: 'Выбрать из списка',
		add: 'Добавить нового'
	}
}

class Tutors extends React.Component {

	state = {
		lectorSelectedType: LectorTypes.keys.collaborator,
		lectorSearchType: LectorNewTypes.keys.select,
		lectorNewSelectedType: LectorNewTypes.keys.select
	}

	handleSelectLectorType(payload){
		this.setState({lectorSelectedType: payload});
	}

	handleSelectNewLectorType(payload){
		this.setState({lectorNewSelectedType: payload});
	}

	handleSelectSearchLectorType(payload){
		this.setState({lectorSearchType: payload});
	}

	handleChangeFirstName(firstName){
        //this.fields.firstName = firstName;
        //this.setState({firstName: firstName});
        EventNewActions.changeNewLectorFirstName(firstName);
    }

    handleChangeLastName(lastName){
        //this.fields.lastName = lastName;
        //this.setState({lastName: lastName});
        EventNewActions.changeNewLectorLastName(lastName);
    }

    handleChangeMiddleName(middleName){
        //this.fields.middleName = middleName;
        //this.setState({middleName: middleName});
        EventNewActions.changeNewLectorMiddleName(middleName);
    }

    handleChangeEmail(email){
        //this.fields.email = email;
        //this.setState({email: email});
        EventNewActions.changeNewLectorEmail(email);
    }

    handleChangeCompany(company){
        //this.fields.company = company;
        //this.setState({company: company});
        EventNewActions.changeNewLectorCompany(company);
    }

	render(){
		const {lectorId, lectorName} = this.props;

		const collaboratorButtonClasses = cx({
			'default-button': true,
			'default-button--selected': this.state.lectorSelectedType === LectorTypes.keys.collaborator
		});
		const collaboratorSelected = this.state.lectorSelectedType === LectorTypes.keys.collaborator;

		const inviteeButtonClasses = cx({
			'default-button': true,
			'default-button--selected': this.state.lectorSelectedType === LectorTypes.keys.invitee
		});
		const inviteeSelected = this.state.lectorSelectedType === LectorTypes.keys.invitee;

		const searchLectorButtonClasses = cx({
			'default-button': true,
			'default-button--selected': this.state.lectorSearchType === LectorNewTypes.keys.select
		});
		const searchLectorSelected = this.state.lectorSearchType === LectorNewTypes.keys.select;
		const newSearchLectorButtonClasses = cx({
			'default-button': true,
			'default-button--selected': this.state.lectorSearchType === LectorNewTypes.keys.add
		});
		const newSearchLectorSelected = this.state.lectorSearchType === LectorNewTypes.keys.add;

		const collaboratorLectorSearchClasses = cx({
			'event-new-tutors__lector-search-collaborator': true,
			'event-new-tutors__lector-search-collaborator--display': this.state.lectorSelectedType === LectorTypes.keys.collaborator && this.state.lectorSearchType === LectorTypes.keys.collaborator
		});
		const inviteeLectorSearchClasses = cx({
			'event-new-tutors__lector-search-invitee': true,
			'event-new-tutors__lector-search-invitee--display': this.state.lectorSearchType === LectorTypes.keys.collaborator
		});

		const lectorNewClasses = cx({
			'event-new-tutors__lector-new': true,
			'event-new-tutors__lector-new--display': this.state.lectorSelectedType === LectorTypes.keys.invitee
		});

		const selectLectorNewButtonClasses = cx({
			'default-button': true,
			'default-button--selected': this.state.lectorNewSelectedType === LectorNewTypes.keys.select
		});
		const selectLectorNewSelected = this.state.lectorNewSelectedType === LectorNewTypes.keys.select;

		const addLectorNewButtonClasses = cx({
			'default-button': true,
			'default-button--selected': this.state.lectorNewSelectedType === LectorNewTypes.keys.add
		});
		const addLectorNewSelected = this.state.lectorNewSelectedType === LectorNewTypes.keys.add;

		const lectorNewSearchCollaborator = cx({
			'event-new-tutors__lector-new-search-collaborator': true,
			'event-new-tutors__lector-new-search-collaborator--display': this.state.lectorNewSelectedType === LectorNewTypes.keys.select && this.state.lectorSelectedType === LectorTypes.keys.invitee
		});
		const createLectorClasses = cx({
			'event-new-tutors__create-lector': true,
			'event-new-tutors__create-lector--display': this.state.lectorNewSelectedType === LectorNewTypes.keys.add && this.state.lectorSelectedType === LectorTypes.keys.invitee
		});
		return (
			<div className="event-new-tutors">
				<ButtonTabs className="event-new-tutors__lector-types">
					<ButtonTab
						onClick={::this.handleSelectLectorType} 
						className={collaboratorButtonClasses} 
						selected={collaboratorSelected} 
						payload={LectorTypes.keys.collaborator} 
						value={LectorTypes.values.collaborator}/>
					<ButtonTab
						onClick={::this.handleSelectLectorType} 
						className={inviteeButtonClasses} 
						selected={inviteeSelected} 
						payload={LectorTypes.keys.invitee} 
						value={LectorTypes.values.invitee}/>
				</ButtonTabs>
				<ButtonTabs className='event-new-tutors__search-lector-types'>
					<ButtonTab
						onClick={::this.handleSelectSearchLectorType} 
						className={searchLectorButtonClasses} 
						selected={searchLectorSelected}
						payload={LectorNewTypes.keys.select} 
						value={LectorNewTypes.values.select}/>
					<ButtonTab
						onClick={::this.handleSelectSearchLectorType} 
						className={newSearchLectorButtonClasses} 
						selected={newSearchLectorSelected} 
						payload={LectorNewTypes.keys.add} 
						value={LectorNewTypes.values.add} />
				</ButtonTabs>
				<LiveSearch
					query={config.url.createPath({action_name: 'forLiveSearchGetLectors', type: 'collaborator'})}
					payload={lectorId}
					value={lectorName}
					onSelect={this.handleSelect}
					placeholder="Выберите преподавателя"
					className={collaboratorLectorSearchClasses}/>
				<LiveSearch
					query={config.url.createPath({action_name: 'forLiveSearchGetCollaborators'})}
					payload={lectorId}
					value={lectorName}
					onSelect={this.handleSelect}
					placeholder="Выберите преподавателя 1"
					className={inviteeLectorSearchClasses}/>

				<ButtonTabs className={lectorNewClasses}>
					<ButtonTab
						onClick={::this.handleSelectNewLectorType} 
						className={selectLectorNewButtonClasses} 
						selected={selectLectorNewSelected}
						payload={LectorNewTypes.keys.select} 
						value={LectorNewTypes.values.select}/>
					<ButtonTab
						onClick={::this.handleSelectNewLectorType} 
						className={addLectorNewButtonClasses} 
						selected={addLectorNewSelected} 
						payload={LectorNewTypes.keys.add} 
						value={LectorNewTypes.values.add} />
				</ButtonTabs>
				<LiveSearch
					query={config.url.createPath({action_name: 'forLiveSearchGetCollaborators', type: 'invitee'})}
					payload={lectorId}
					value={lectorName}
					onSelect={this.handleSelect}
					placeholder="Выберите преподавателя"
					className={lectorNewSearchCollaborator}/>
				<div className={createLectorClasses}>
					 <TextView
                        onChange={::this.handleChangeFirstName} 
                        value={this.props.firstName} 
                        placeholder="Имя *" 
                        className="new-lector__first-name"/>
                    <TextView
                        onChange={::this.handleChangeLastName} 
                        value={this.props.lastName} 
                        placeholder="Фамилия *" 
                        className="new-lector__last-name"/>
                    <TextView
                        onChange={::this.handleChangeMiddleName} 
                        value={this.props.middleName} 
                        placeholder="Отчество" 
                        className="new-lector__middle-name"/>
                    <TextView
                        onChange={::this.handleChangeEmail} 
                        value={this.props.email} 
                        placeholder="Электронная почта *" 
                        className="new-lector__email"/>
                    <TextView
                        onChange={::this.handleChangeCompany} 
                        value={this.props.company} 
                        placeholder="Компания *" 
                        className="new-lector__company"/>
				</div>
			</div>
		);
	}
};

export default Tutors;