import React from 'react';
import CheckBox from 'components/modules/checkbox';
import DropDownIcon from 'components/modules/dropdown-icon';
import SelectItems from 'components/modules/select-items';
import EventEditActions from 'actions/EventEditActions';
import {some} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-tutors.scss';

class TutorItem extends React.Component {

	handleToggleIsMain(){
		EventEditActions.tutors.toggleTutorIsMain(this.props.id, !this.props.main);
	}

	handleToggleChecked(){
		EventEditActions.tutors.toggleTutorChecked(this.props.id, !this.props.checked);
	}

	render(){
		var {fullname, subdivision, position, main, checked} = this.props;
		const classes = cx({
			'table-list__body-row': true,
			'table-list__body-row--selected': checked
		})
		return (
			<div className={classes}>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<i className="fa fa-user"></i>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{position}</div>
				<div className="table-list__body-cell">{subdivision}</div>
				<div className="table-list__body-cell">
					<div className="toggle-btn">
						<input onChange={::this.handleToggleIsMain} type="checkbox" className="toggle__input" id={this.props.id} checked={main}/>
						<label className="toggle__checkbox" htmlFor={this.props.id}></label>
					</div>
				</div>
			</div>
		);
	}
}

class LectorItem extends React.Component {

	handleToggleChecked(){
		EventEditActions.tutors.toggleLectorChecked(this.props.id, !this.props.checked);
	}

	render(){
		const {fullname, type, checked} = this.props;
		const classes = cx({
			'table-list__body-row': true,
			'table-list__body-row--selected': checked
		})
		return (
			<div className={classes}>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<i className="fa fa-user"></i>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{type}</div>
			</div>
		);
	}
}

class Tutors extends React.Component {

	constructor(props){
		super(props);

		this.handleUpdateTutors = this.handleUpdateTutors.bind(this);
		this.handleUpdateLectors = this.handleUpdateLectors.bind(this);

		this.handleCloseTutorsModal= this.handleCloseTutorsModal.bind(this);
		this.handleCloseLectorsModal= this.handleCloseLectorsModal.bind(this);
	}

	state = {
		isShowTutorsModal: false,
		isShowLectorsModal: false
	}

	_isSomeChecked(items){
		return some(items, {checked: true});
	}

	_prepareTutorsForModal(tutors){
		return tutors.map((t) => {
			return {
				id: t.id,
				data: {
					fullname: t.fullname,
					subdivision: t.subdivision,
					position: t.position,
					main: t.main,
					checked: t.checked
				}	
			}
		})
	}

	_prepareLectorsForModal(lectors){
		return lectors.map((l) => {
			return {
				id: l.id,
				data: {
					fullname: l.fullname,
					type: l.type,
					checked: l.checked
				}	
			}
		})
	}

	_getTutorsModal(){
		let selectedItems = this._prepareTutorsForModal(this.props.tutors);
		return this.state.isShowTutorsModal ? 
			<SelectItems
				title="Выберите ответственных"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getCollaborators'})}
				onClose={this.handleCloseTutorsModal} 
				onSave={this.handleUpdateTutors}/> : null;
	}

	_getLectorsModal(){
		let selectedItems = this._prepareLectorsForModal(this.props.lectors);
		return this.state.isShowLectorsModal ? 
			<SelectItems
				title="Выберите преподавателей"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getLectors'})}
				onClose={this.handleCloseLectorsModal} 
				onSave={this.handleUpdateLectors}/> : null;
	}

	handleSortTutors(e, payload){
		EventEditActions.tutors.sortTutorsTable(payload);
	}

	handleSortLectors(e, payload){
		EventEditActions.tutors.sortLectorsTable(payload);
	}

	handleToggleCheckedTutorsConditions(e, payload){
		EventEditActions.tutors.toggleCheckedTutorsConditions(payload);
	}

	handleToggleCheckedAllTutors(){
		EventEditActions.tutors.toggleCheckedAllTutors(!this.props.checkedAllTutors);
	}

	handleToggleCheckedAllLectors(){
		EventEditActions.tutors.toggleCheckedAllLectors(!this.props.checkedAllLectors);
	}

	handleRemoveTutors(){
		EventEditActions.tutors.removeTutors();
	}

	handleRemoveLectors(){
		EventEditActions.tutors.removeLectors();
	}

	handleOpenTutorsModal(){
		this.setState({isShowTutorsModal: true});
	}

	handleOpenLectorsModal(){
		this.setState({isShowLectorsModal: true});
	}

	handleCloseTutorsModal(){
		this.setState({isShowTutorsModal: false});
	}

	handleCloseLectorsModal(){
		this.setState({isShowLectorsModal: false});
	}

	handleUpdateTutors(tutors){
		this.setState({isShowTutorsModal: false});
		EventEditActions.tutors.updateTutors(tutors);
	}

	handleUpdateLectors(lectors){
		this.setState({isShowLectorsModal: false});
		EventEditActions.tutors.updateLectors(lectors);
	}

	render(){
		const isDisplayTutorsButtons = this._isSomeChecked(this.props.tutors) && this.props.tutors.length > 0;
		const isDisplayLectorsButtons = this._isSomeChecked(this.props.lectors) && this.props.lectors.length > 0;

		const tableDescTutorsrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.tutors.length === 0
		});
		const tableDescrLectorsClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.lectors.length === 0
		});

		const removeTutorsClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isDisplayTutorsButtons
		});
		const checkboxTutorsClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.tutors.length > 0
		});
		const dropDownTutorsClasses = cx({
			'buttons__dropdown': true,
			'buttons__dropdown--display': this.props.tutors.length > 0
		});

		const removeLectorsClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isDisplayLectorsButtons
		});
		const checkboxLectorsClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.lectors.length > 0
		});
		const dropDownLectorsClasses = cx({
			'buttons__dropdown': true,
			'buttons__dropdown--display': this.props.lectors.length > 0
		});
		return (
			<div className="event-edit-tutors">
				<div className="tutors">
					<div className="buttons">
						<DropDownIcon onChange={this.handleToggleCheckedTutorsConditions} items={this.props.checkedTutorTypes} className={checkboxTutorsClasses}>
							<CheckBox onChange={::this.handleToggleCheckedAllTutors} checked={this.props.checkedAllTutors} className={checkboxTutorsClasses}/>
						</DropDownIcon>
						<DropDownIcon onChange={this.handleSortTutors} items={this.props.sortTutorTypes} className={dropDownTutorsClasses}>
							<i className="fa fa-sort"></i>
						</DropDownIcon>
						<div className="buttons__funcs">
							<button onClick={::this.handleOpenTutorsModal} className="buttons__add" title="Добавить участников">
								<i className="fa fa-user-plus"></i>
							</button>
							<button onClick={this.handleRemoveTutors} className={removeTutorsClasses} title="Удалить участников">
								<i className="fa fa-user-times"></i>
							</button>
						</div>
					</div>
					<strong className="tutors__description">Ответственные</strong>
					<div className="table-list tutor-list">
						<span className={tableDescTutorsrClasses}>Нет ответственных</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.tutors.map((item, index) => {
									return <TutorItem key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getTutorsModal()}
					</div>
				</div>
				<div className="lectors">
					<div className="buttons">
						<DropDownIcon className={checkboxLectorsClasses}>
							<CheckBox onChange={::this.handleToggleCheckedAllLectors} checked={this.props.checkedAllLectors} className={checkboxLectorsClasses}/>
						</DropDownIcon>
						<DropDownIcon onChange={this.handleSortLectors} items={this.props.sortLectorTypes} className={dropDownLectorsClasses}>
							<i className="fa fa-sort"></i>
						</DropDownIcon>
						<div className="buttons__funcs">
							<button onClick={::this.handleOpenLectorsModal} className="buttons__add" title="Добавить участников">
								<i className="fa fa-user-plus"></i>
							</button>
							<button onClick={this.handleRemoveLectors} className={removeLectorsClasses} title="Удалить участников">
								<i className="fa fa-user-times"></i>
							</button>
						</div>
					</div>
					<strong className="lectors__description">Преподаватели</strong>
					<div className="table-list lector-list">
						<span className={tableDescrLectorsClasses}>Нет преподавателей</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.lectors.map((item, index) => {
									return <LectorItem key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getLectorsModal()}
					</div>
				</div>
			</div>
		);
	}
};

export default Tutors;