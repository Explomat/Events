import React from 'react';
import CheckBox from 'components/modules/checkbox';
import SelectItems from 'components/modules/select-items';
import EventEditActions from 'actions/EventEditActions';
import {some} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-tutors.scss';

class Buttons extends React.Component {
	render(){
		let removeClasses = cx({
			'event-btn': true,
			'buttons__remove': true,
			'buttons__remove--display': this.props.isDisplay
		});
		return (
			<div className="buttons">
				<button onClick={this.props.onAdd} className="event-btn buttons__add">Добавить</button>
				<button onClick={this.props.onRemove} className={removeClasses}>Удалить</button>
			</div>
		);
	}
}

class TutorItem extends React.Component {

	handleToggleIsMain(){
		EventEditActions.tutors.toggleTutorIsMain(this.props.id, !this.props.main);
	}

	handleToggleChecked(){
		EventEditActions.tutors.toggleTutorChecked(this.props.id, !this.props.checked);
	}

	render(){
		let {fullname, subdivision, position, main, checked} = this.props;
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
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
		let {fullname, type, checked} = this.props;
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
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

	handleSortTutors(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.tutors.sortTutorsTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
	}

	handleSortLectors(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.tutors.sortLectorsTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
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
		let checkBoxContainerTutorsClasses = cx({
			'table-list__header-cell': true,
			'table-list__header-cell--w1': true,
			'table-list__header-cell--no-hover': true,
			'table-list__header-cell--hide': this.props.tutors.length === 0
		});
		let checkBoxContainerLectorsClasses = cx({
			'table-list__header-cell': true,
			'table-list__header-cell--w1': true,
			'table-list__header-cell--no-hover': true,
			'table-list__header-cell--hide': this.props.lectors.length === 0
		});
		let isDisplayTutorsButtons = this._isSomeChecked(this.props.tutors) && this.props.tutors.length > 0;
		let isDisplayLectorsButtons = this._isSomeChecked(this.props.lectors) && this.props.lectors.length > 0;
		return (
			<div className="event-edit-tutors">
				<div className="tutors">
					<Buttons onRemove={this.handleRemoveTutors} onAdd={::this.handleOpenTutorsModal} isDisplay={isDisplayTutorsButtons}/>
					<strong className="tutors__description">Ответственные</strong>
					<div className="table-list tutor-list">
						<div className="table-list__header table-list__header--header">
							<div className="table-list__header-row">
								<div className={checkBoxContainerTutorsClasses}>
									<CheckBox onChange={::this.handleToggleCheckedAllTutors} checked={this.props.checkedAllTutors}/>
								</div>
								<div onClick={this.handleSortTutors} className="table-list__header-cell table-list__header-cell--w30" data-sort="fullname">
									<span className="table-list__header-cell-name">ФИО</span>
									<span className="caret table-list__caret"></span>
								</div>
								<div onClick={this.handleSortTutors} className="table-list__header-cell table-list__header-cell--w25" data-sort="position">
									<span className="table-list__header-cell-name">Должность</span>
									<span className="caret table-list__caret"></span>
								</div>
								<div onClick={this.handleSortTutors} className="table-list__header-cell table-list__header-cell--w25" data-sort="subdivision">
									<span className="table-list__header-cell-name">Подразделение</span>
									<span className="caret table-list__caret"></span>
								</div>
								<div onClick={this.handleSortTutors} className="table-list__header-cell table-list__header-cell--w1" data-sort="main">
									<span className="table-list__header-cell-name">Статус</span>
									<span className="caret table-list__caret"></span>
								</div>
							</div>
						</div>
						<div className="table-list__table">
							<div className="table-list__header">
								<div className="table-list__header-row">
									<div className="table-list__header-cell table-list__header-cell--w1"></div>
									<div className="table-list__header-cell table-list__header-cell--w30">ФИО</div>
									<div className="table-list__header-cell table-list__header-cell--w25">Должность</div>
									<div className="table-list__header-cell table-list__header-cell--w25">Подразделение</div>
									<div className="table-list__header-cell table-list__header-cell--w1">Статус</div>
								</div>
								{this.props.tutors.map((item, index) => {
									return <TutorItem key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getTutorsModal()}
					</div>
				</div>
				<div className="lectors">
					<Buttons onRemove={this.handleRemoveLectors} onAdd={::this.handleOpenLectorsModal} isDisplay={isDisplayLectorsButtons}/>
					<strong className="lectors__description">Преподаватели</strong>
					<div className="table-list lector-list">
						<div className="table-list__header table-list__header--header">
							<div className="table-list__header-row">
								<div className={checkBoxContainerLectorsClasses}>
									<CheckBox onChange={::this.handleToggleCheckedAllLectors} checked={this.props.checkedAllLectors}/>
								</div>
								<div onClick={this.handleSortLectors} className="table-list__header-cell table-list__header-cell--w30" data-sort="fullname">
									<span className="table-list__header-cell-name">ФИО</span>
									<span className="caret table-list__caret"></span>
								</div>
								<div onClick={this.handleSortLectors} className="table-list__header-cell table-list__header-cell--w25" data-sort="type">
									<span className="table-list__header-cell-name">Тип</span>
									<span className="caret table-list__caret"></span>
								</div>
							</div>
						</div>
						<div className="table-list__table">
							<div className="table-list__header">
								<div className="table-list__header-row">
									<div className="table-list__header-cell table-list__header-cell--w1"></div>
									<div className="table-list__header-cell table-list__header-cell--w30"></div>
									<div className="table-list__header-cell table-list__header-cell--w25"></div>
								</div>
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