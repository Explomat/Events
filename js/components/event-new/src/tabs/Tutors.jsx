import React from 'react';
import { ButtonTabs, ButtonTab } from 'components/modules/button-tabs';
import {TextView} from 'components/modules/text-label';
import LiveSearch from 'components/modules/live-search';
import LectorTypes from 'utils/eventedit/LectorTypes';
import LectorSelectTypes from 'utils/eventnew/LectorSelectTypes';

import EventNewActions from 'actions/EventNewActions';
import cx from 'classnames';

import config from 'config';

class Tutors extends React.Component {

	handleSelectLectorType(payload){
		EventNewActions.tutors.selectLectorType(payload);
	}

	handleSelectAddLectorType(payload){
		EventNewActions.tutors.selectAddLectorType(payload);
	}

	handleSelectSearchLectorType(payload){
		EventNewActions.tutors.selectSearchLectorType(payload);
	}

	handleSelectInnerListLector(payload, value){
		EventNewActions.tutors.selectInnerListLector(payload, value);
	}

	handleResetInnerListLector(payload, value){
		EventNewActions.tutors.selectInnerListLector(null, value);
	}

	handleSelectInnerNewLector(payload, value){
		EventNewActions.tutors.selectInnerNewLector(payload, value);
	}

	handleResetInnerNewLector(payload, value){
		EventNewActions.tutors.selectInnerNewLector(null, value);
	}

	handleSelectOuterListLector(payload, value){
		EventNewActions.tutors.selectOuterListLector(payload, value);
	}

	handleResetOuterListLector(payload, value){
		EventNewActions.tutors.selectOuterListLector(null, value);
	}

	handleChangeFirstName(firstName){
        //this.fields.firstName = firstName;
        //this.setState({firstName: firstName});
        EventNewActions.tutors.changeLectorFirstName(firstName);
    }

    handleChangeLastName(lastName){
        //this.fields.lastName = lastName;
        //this.setState({lastName: lastName});
        EventNewActions.tutors.changeLectorLastName(lastName);
    }

    handleChangeMiddleName(middleName){
        //this.fields.middleName = middleName;
        //this.setState({middleName: middleName});
        EventNewActions.tutors.changeLectorMiddleName(middleName);
    }

    handleChangeEmail(email){
        //this.fields.email = email;
        //this.setState({email: email});
        EventNewActions.tutors.changeLectorEmail(email);
    }

    handleChangeCompany(company){
        //this.fields.company = company;
        //this.setState({company: company});
        EventNewActions.tutors.changeLectorCompany(company);
    }

	render(){
		const { lectorSelectedType, lectorSearchType, lectorAddSelectedType } = this.props;
		const {innerListLectorId, innerListLectorFullname, innerNewLectorId, innerNewLectorFullname, outerListLectorId, outerListLectorFullname} = this.props;
		const {firstName, lastName, middleName, email, company} = this.props.lector;

		const lectorTypeInnerSelectedButton = lectorSelectedType === LectorTypes.keys.collaborator;
		const lectorTypeOuterSelectedButton = lectorSelectedType === LectorTypes.keys.invitee;

		const selectLectorTypeInnerClasses = cx({
			'lector-types-inner': true,
			'lector-types-inner--display': lectorTypeInnerSelectedButton
		});
		const selectListInnerSelectedButton = lectorTypeInnerSelectedButton && lectorSearchType === LectorSelectTypes.keys.select;
		const selectAddInnerSelectedButton = lectorTypeInnerSelectedButton && lectorSearchType === LectorSelectTypes.keys.add;
		
		const selectLectorTypeOuterClasses = cx({
			'lector-types-outer': true,
			'lector-types-outer--display': lectorTypeOuterSelectedButton
		});
		const selectListOuterSelectedButton = lectorAddSelectedType === LectorSelectTypes.keys.select;
		const selectAddOuterSelectedButton = lectorAddSelectedType === LectorSelectTypes.keys.add;

		const innerListSearch = cx({
			'lector-types-inner-list-search': true,
			'lector-types-inner-list-search--display': lectorTypeInnerSelectedButton && selectListInnerSelectedButton
		});
		const innerAddSearch = cx({
			'lector-types-inner-add-search': true,
			'lector-types-inner-add-search--display': lectorTypeInnerSelectedButton && selectAddInnerSelectedButton
		});

		const outerListSearch = cx({
			'lector-types-outer-list-search': true,
			'lector-types-outer-list-search--display': lectorTypeOuterSelectedButton && selectListOuterSelectedButton
		});
		const outerAdd = cx({
			'lector-types-outer-add': true,
			'lector-types-outer-add--display': lectorTypeOuterSelectedButton && selectAddOuterSelectedButton
		});
		return (
			<div className="event-new-tutors">
				<ButtonTabs className="lector-types">
					<ButtonTab
						onClick={::this.handleSelectLectorType}
						payload={LectorTypes.keys.collaborator} 
						value={LectorTypes.values.collaborator}
						selected={lectorTypeInnerSelectedButton}/>
					<ButtonTab
						onClick={::this.handleSelectLectorType} 
						payload={LectorTypes.keys.invitee} 
						value={LectorTypes.values.invitee}
						selected={lectorTypeOuterSelectedButton}/>
				</ButtonTabs>
				<ButtonTabs className={selectLectorTypeInnerClasses}>
					<ButtonTab
						onClick={::this.handleSelectSearchLectorType} 
						payload={LectorSelectTypes.keys.select} 
						value={LectorSelectTypes.values.select}
						selected={selectListInnerSelectedButton}/>
					<ButtonTab
						onClick={::this.handleSelectSearchLectorType} 
						payload={LectorSelectTypes.keys.add} 
						value={LectorSelectTypes.values.add}
						selected={selectAddInnerSelectedButton}/>
				</ButtonTabs>
				<ButtonTabs className={selectLectorTypeOuterClasses}>
					<ButtonTab
						onClick={::this.handleSelectAddLectorType} 
						payload={LectorSelectTypes.keys.select} 
						value={LectorSelectTypes.values.select}
						selected={selectListOuterSelectedButton}/>
					<ButtonTab
						onClick={::this.handleSelectAddLectorType}
						payload={LectorSelectTypes.keys.add} 
						value={LectorSelectTypes.values.add} 
						selected={selectAddOuterSelectedButton}/>
				</ButtonTabs>
				<LiveSearch
					query={config.url.createPath({action_name: 'forLiveSearchGetLectors', type: 'collaborator'})}
					payload={innerListLectorId}
					value={innerListLectorFullname}
					onSelect={this.handleSelectInnerListLector}
					onChange={this.handleResetInnerListLector}
					placeholder="Преподаватель *"
					className={innerListSearch}/>
				<LiveSearch
					query={config.url.createPath({action_name: 'forLiveSearchGetCollaborators'})}
					payload={innerNewLectorId}
					value={innerNewLectorFullname}
					onSelect={this.handleSelectInnerNewLector}
					onChange={this.handleResetInnerNewLector}
					placeholder="Преподаватель *"
					className={innerAddSearch}/>
				<LiveSearch
					query={config.url.createPath({action_name: 'forLiveSearchGetLectors', type: 'invitee'})}
					payload={outerListLectorId}
					value={outerListLectorFullname}
					onSelect={this.handleSelectOuterListLector}
					onChange={this.handleResetOuterListLector}
					placeholder="Преподаватель *"
					className={outerListSearch}/>
				<div className={outerAdd}>
					 <TextView
                        onChange={::this.handleChangeFirstName} 
                        value={firstName} 
                        placeholder="Имя *" 
                        className="new-lector__first-name"/>
                    <TextView
                        onChange={::this.handleChangeLastName} 
                        value={lastName} 
                        placeholder="Фамилия *" 
                        className="new-lector__last-name"/>
                    <TextView
                        onChange={::this.handleChangeMiddleName} 
                        value={middleName} 
                        placeholder="Отчество" 
                        className="new-lector__middle-name"/>
                    <TextView
                        onChange={::this.handleChangeEmail} 
                        value={email} 
                        placeholder="Электронная почта *" 
                        className="new-lector__email"/>
                    <TextView
                        onChange={::this.handleChangeCompany} 
                        value={company} 
                        placeholder="Компания *" 
                        className="new-lector__company"/>
				</div>
			</div>
		);
	}
};

export default Tutors;