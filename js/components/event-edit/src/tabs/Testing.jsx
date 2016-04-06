import React from 'react';
import CheckBox from 'components/modules/checkbox';
import SelectItems from 'components/modules/select-items';
import EventEditActions from 'actions/EventEditActions';
import {some} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-testing.scss';

class Buttons extends React.Component {
	render(){
		let addButtonClasses = cx({
			'event-btn': true,
			'buttons__re-active': true,
			'buttons__re-active--display': this.props.isDisplay
		});
		return (
			<div className="buttons">
				<button onClick={this.props.onReActive} className={addButtonClasses}>Переназначить</button>
			</div>
		);
	}
}

class TestingItem extends React.Component {

	handleToggleIsAssist(){
		EventEditActions.testing.toggleIsAssist(this.props.id, !this.props.isAssist);
	}

	handleToggleChecked(){
		EventEditActions.testing.toggleChecked(this.props.id, !this.props.checked);
	}

	render(){
		let {fullname, type, finishDate, result, checked} = this.props;
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{type}</div>
				<div className="table-list__body-cell">{finishDate}</div>
				<div className="table-list__body-cell">{result}</div>
				<div className="table-list__body-cell">
					<div className="toggle-btn">
						<input onChange={::this.handleToggleIsAssist} type="checkbox" className="toggle__input"  id={this.props.id} checked={checked}/>
						<label className="toggle__checkbox" htmlFor={this.props.id}></label>
					</div>
				</div>
			</div>
		);
	}
}

class Testing extends React.Component {

	constructor(props){
		super(props);
		this.handleUpdateItems = this.handleUpdateItems.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleCloseNotificateModal = this.handleCloseNotificateModal.bind(this);
		this.handleNotificateItems = this.handleNotificateItems.bind(this);
	}

	state = {
		isShowModal: false
	}

	_isSomeChecked(){
		return some(this.props.testingList, {checked: true});
	}

	_prepareTestingListForModal(testingList){
		return testingList.map((tl) => {
			return {
				id: tl.id,
				data: {
					fullname: tl.fullname,
					type: tl.type,
					finishDate: tl.finishDate,
					result: tl.result,
					checked: tl.checked
				}	
			}
		})
	}

	_getTestingListModal(){
		let selectedItems = this._prepareTestingListForModal(this.props.testingList);
		return this.state.isShowModal ? 
			<SelectItems
				title="Выберите участников"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getTests'})}
				onClose={this.handleCloseModal} 
				onSave={this.handleUpdateItems}/> : null;
	}

	handleSort(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.testing.sortTestingTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
	}

	handleToggleCheckedAll(){
		EventEditActions.testing.toggleCheckedAll(!this.props.checkedAll);
	}

	handleRemoveItems(){
		EventEditActions.testing.removeItems();
	}

	handleOpenModal(){
		this.setState({isShowModal: true});
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

	handleUpdateItems(items){
		this.setState({isShowModal: false});
		EventEditActions.testing.updateItems(items);
	}

	handleRemoveInfoMessage(){
		EventEditActions.testing.changeInfoMessage('');
	}

	render(){
		let checkBoxContainerClasses = cx({
			'table-list__header-cell': true,
			'table-list__header-cell--w1': true,
			'table-list__header-cell--no-hover': true,
			'table-list__header-cell--hide': this.props.collaborators.length === 0
		});
		let isDisplayButtons = this._isSomeChecked() && this.props.collaborators.length > 0;
		return (
			<div className="event-edit-collaborators">
				<Buttons onRemove={this.handleRemoveItems} onNotificate={::this.handleOpenNotificateModal} onAdd={::this.handleOpenModal} isDisplay={isDisplayButtons}/>
				<div className="table-list collaborators-list">
					<div className="table-list__header table-list__header--header">
						<div className="table-list__header-row">
							<div className={checkBoxContainerClasses}>
								<CheckBox onChange={::this.handleToggleCheckedAll} checked={this.props.checkedAll}/>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w40" data-sort="fullname">
								<span className="table-list__header-cell-name">Название</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w20" data-sort="type">
								<span className="table-list__header-cell-name">Тип</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w20" data-sort="finishDate">
								<span className="table-list__header-cell-name">Дата завершения</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w10" data-sort="result">
								<span className="table-list__header-cell-name">Результат теста (%)</span>
								<span className="caret table-list__caret"></span>
							</div>
						</div>
					</div>
					<div className="table-list__table">
						<div className="table-list__header">
							<div className="table-list__header-row">
								<div className="table-list__header-cell table-list__header-cell--w1"></div>
								<div className="table-list__header-cell table-list__header-cell--w40"></div>
								<div className="table-list__header-cell table-list__header-cell--w20"></div>
								<div className="table-list__header-cell table-list__header-cell--w20"></div>
								<div className="table-list__header-cell table-list__header-cell--w10"></div>
							</div>
							{this.props.collaborators.map((item, index) => {
								return <TestingItem key={index} {...item}/>
							})}
						</div>
					</div>
					{this._getCollaboratorsModal()}
				</div>
			</div>
		);
	}
};

export default Testing;