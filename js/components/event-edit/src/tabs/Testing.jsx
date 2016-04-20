import React from 'react';
import CheckBox from 'components/modules/new-checkbox';
import DropDownIcon from 'components/modules/dropdown-icon';
import SelectItems from 'components/modules/select-items';
import EventEditActions from 'actions/EventEditActions';
import TestTypes from 'utils/eventedit/TestTypes';
import {some, pick} from 'lodash';
import cx from 'classnames';
import config from 'config';

import '../style/event-edit-testing.scss';

class Test extends React.Component {

	handleToggleChecked(){
		EventEditActions.testing.toggleChecked(this.props.id, !this.props.checked);
	}

	render(){
		const {name, code, type, checked} = this.props;
		const classes = cx({
			'table-list__body-row': true,
			'table-list__body-row--selected': checked
		})
		return(
			<div className={classes}>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell">{code}</div>
				<div className="table-list__body-cell">{name}</div>
				<div className="table-list__body-cell">{TestTypes.values[type]}</div>
			</div>
		);
	}
}

class Tests extends React.Component {

	constructor(props){
		super(props);
		this.testType = null;
	}

	state = {
		isShowTestsModal: false
	}

	_isSomeChecked(items){
		return some(items, {checked: true});
	}

	_prepareTestsForModal(tests){
		return tests.map((t) => {
			return {
				id: t.id,
				data: {
					name: t.name,
					code: t.code,
					type: t.type
				}	
			}
		})
	}

	_getTestsModal(){
		var type = this.testType;
		var handleUpdate = this.handleUpdateTests.bind(this, type);
		var selectedItems = this._prepareTestsForModal(this.props.allTests);
		return this.state.isShowTestsModal ? 
			<SelectItems
				title="Выберите тесты"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getTests'})}
				onClose={::this.handleCloseTestsModal} 
				onSave={handleUpdate}/> : null;
	}

	handleSelectTestsType(e, payload){
		EventEditActions.testing.selectTestTypes(payload);
	}

	handleSortAllTests(e, payload){
		EventEditActions.testing.sortAllTests(payload);
	}

	handleUpdateTests(type, items){
		this.setState({isShowTestsModal: false});
		EventEditActions.testing.updateTests(items, type);
	}

	handleCloseTestsModal(){
		this.setState({isShowTestsModal: false});
	}

	handleOpenTestsModal(e, payload){
		this.testType = payload;
		this.setState({ isShowTestsModal: true});
	}

	handleToggleCheckedAll(){
		EventEditActions.testing.toggleCheckedAll(!this.props.checkedAll);
	}

	handleRemoveTests(){
		EventEditActions.testing.removeTests();
	}

	render(){
		const tableDescrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.allTests.length === 0
		});
		const checkboxClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.allTests.length > 0
		});
		const sortClasses = cx({
			'buttons__sort': true,
			'buttons__sort--display': this.props.allTests.length > 0
		});
		const removeClasses = cx({
			'default-button': true,
			'buttons__remove': true,
			'buttons__remove--display': this._isSomeChecked(this.props.allTests) && this.props.allTests.length > 0
		});
		return(
			<div className="event-edit-testing__tests">
				<div className="buttons">
					<DropDownIcon onChange={this.handleSelectTestsType} className={checkboxClasses} items={this.props.selectTypes}>
						<CheckBox onChange={::this.handleToggleCheckedAll} checked={this.props.checkedAll} className={checkboxClasses}/>
					</DropDownIcon>
					<DropDownIcon onChange={::this.handleSortAllTests} className={sortClasses} items={this.props.sortTestTypes}>
						<i className="fa fa-sort"></i>
					</DropDownIcon>
					<DropDownIcon onChange={::this.handleOpenTestsModal} className="buttons__add" items={this.props.testTypes}>
						<i className="fa fa-plus"></i>
					</DropDownIcon>
					<button onClick={this.handleRemoveTests} className={removeClasses} title="Удалить файлы">
						<i className="fa fa-minus"></i>
					</button>
				</div>
				<div className="table-list all-tests-list">
					<span className={tableDescrClasses}>Нет тестов</span>
					<div className="table-list__table">
						<div className="table-list__header">
							{this.props.allTests.map((item, index) => {
								return <Test key={index} {...item}/>
							})}
						</div>
					</div>
				</div>
				{this._getTestsModal()}
			</div>
		);
	}
}


class TestingItem extends React.Component {

	handleToggleIsAssist(){
		EventEditActions.testing.toggleIsAssist(this.props.id, !this.props.isAssist);
	}

	render(){
		const {fullname, assessmentName, score} = this.props;
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{assessmentName}</div>
				<div className="table-list__body-cell">{score}</div>
			</div>
		);
	}
}

class Testing extends React.Component {

	handleSortTestingList(e, payload){
		EventEditActions.testing.sortTestingList(payload);
	}

	render(){
		const tableDescrClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.testingList.length === 0
		});
		const dropdownSortClasses = cx({
			'buttons__sort': true,
			'buttons__sort--display': this.props.testingList.length > 0
		});
		return (
			<div className="event-edit-testing">
				<Tests ref="tests" {...pick(this.props, ['isPostTestOnlyForAssisst', 'allTests', 'checkedAll', 'testTypes', 'selectTypes', 'sortTestTypes'])}/>
				<div className="testing">
					<div className="buttons">
						<DropDownIcon onChange={::this.handleSortTestingList} items={this.props.sortTypes} className={dropdownSortClasses}>
							<i className="fa fa-sort"></i>
						</DropDownIcon>
					</div>
					<strong className="testing__description">Результаты тестирования</strong>
					<div className="table-list testing-list">
						<span className={tableDescrClasses}>Нет результатов тестирования</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.testingList.map((item, index) => {
									return <TestingItem key={index} {...item}/>
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Testing;