import React from 'react';
import CheckBox from 'components/modules/new-checkbox';
import {DropDownIcon, DropDownIconItem} from 'components/modules/dropdown-icon';
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
				<div className="table-list__body-cell table-list__body-cell--70">{name}</div>
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
			'buttons__checkbox--display': this.props.allTests.length > 0,
			'default-button': true
		});
		const sortClasses = cx({
			'buttons__sort': true,
			'buttons__sort--display': this.props.allTests.length > 0,
			'default-button': true
		});
		const removeClasses = cx({
			'default-button': true,
			'buttons__remove': true,
			'buttons__remove--display': this._isSomeChecked(this.props.allTests) && this.props.allTests.length > 0
		});
		return(
			<div className="event-edit-testing__tests">
				<div className="buttons">
					<DropDownIcon 
						className={checkboxClasses}
						icon={<CheckBox 
								onChange={::this.handleToggleCheckedAll} 
								checked={this.props.checkedAll} 
								className={checkboxClasses}/>}>
						<DropDownIconItem onClick={this.handleSelectTestsType} payload='{"type": "prev"}' text='Предварительные тесты'/>
						<DropDownIconItem onClick={this.handleSelectTestsType} payload='{"type": "post"}' text='Пост-тесты'/>
					</DropDownIcon>
					<div className="buttons__funcs">
						<DropDownIcon
							icon={<i className="icon-arrow-combo"></i>} 
							className={sortClasses}>
								<DropDownIconItem onClick={::this.handleSortAllTests} payload='{"key": "name", "isAsc": "true"}' text='Сортировать по имени(А-я)'/>
								<DropDownIconItem onClick={::this.handleSortAllTests} payload='{"key": "name", "isAsc": "false"}' text='Сортировать по имени(я-А)'/>
								<DropDownIconItem onClick={::this.handleSortAllTests} payload='{"key": "type", "isAsc": "true"}' text='Сортировать по типу(А-я)'/>
								<DropDownIconItem onClick={::this.handleSortAllTests} payload='{"key": "type", "isAsc": "false"}' text='Сортировать по типу(я-А)'/>
						</DropDownIcon>
						<DropDownIcon 
							icon={<i className="icon-plus"></i>}
							className="buttons__add default-button">
								<DropDownIconItem onClick={::this.handleOpenTestsModal} payload='prev' text='Выбрать предварительные тесты'/>
								<DropDownIconItem onClick={::this.handleOpenTestsModal} payload='post' text='Выбрать пост-тесты'/>
						</DropDownIcon>
						<button onClick={this.handleRemoveTests} className={removeClasses} title="Удалить файлы">
							<i className="icon-minus buttons__icon"></i>
						</button>
					</div>
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

	_getScoreThreshold(thresholds, percent){
		for (var i = 0, len = thresholds.length; i < len - 1; i++) {
			let min = thresholds[i];
			let max = thresholds[i + 1];
			if (percent > min && percent <= max) {
				return i;
			}
		};
		return 1;
	}

	handleToggleIsAssist(){
		EventEditActions.testing.toggleIsAssist(this.props.id, !this.props.isAssist);
	}

	render(){
		const {fullname, assessmentName, region, score, percent, thresholds, thresholdColors} = this.props;
		const cellColorStyle = thresholdColors[this._getScoreThreshold(thresholds, percent)];
		const scoreClasses = cx({
			'testing-list__score': true,
			'testing-list__score--display': score !== 0
		});
		const percentClasses = cx({
			'testing-list__percent': true,
			'testing-list__percent--display': score !== 0
		});
		const scoreIsNullClasses = cx({
			'testing-list__score-is-null': true,
			'testing-list__score-is-null--display': score === 0
		});
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{assessmentName}</div>
				<div className="table-list__body-cell">{region}</div>
				<div className="table-list__body-cell table-list__body-cell--15" style={{'backgroundColor': cellColorStyle}}>
					<strong className={scoreClasses}>{score}</strong>
					<span className={percentClasses}>({percent}%)</span>
					<span className={scoreIsNullClasses}>В процессе</span>
				</div>
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
			'buttons__sort--display': this.props.testingList.length > 0,
			'default-button': true
		});
		const exportToExcelClasses = cx({
			'default-button': true,
			'testing__export-to-excel': true,
			'testing__export-to-excel--display': this.props.testingList.length > 0
		});
		return (
			<div className="event-edit-testing">
				<Tests ref="tests" {...pick(this.props, ['isPostTestOnlyForAssisst', 'allTests', 'checkedAll'])}/>
				<div className="testing">
					<div className="buttons">
						<DropDownIcon
							icon={<i className="icon-arrow-combo"></i>} 
							className={dropdownSortClasses}>
								<DropDownIconItem onClick={::this.handleSortTestingList} payload='{"key": "fullname", "isAsc": "true"}' text='Сортировать по ФИО(А-я)'/>
								<DropDownIconItem onClick={::this.handleSortTestingList} payload='{"key": "fullname", "isAsc": "false"}' text='Сортировать по ФИО(я-А)'/>
								<DropDownIconItem onClick={::this.handleSortTestingList} payload='{"key": "score", "isAsc": "false"}' text='Сортировать по результату(по убыванию)'/>
								<DropDownIconItem onClick={::this.handleSortTestingList} payload='{"key": "score", "isAsc": "true"}' text='Сортировать по результату(по возрастанию)'/>
						</DropDownIcon>
						<a href={config.url.createPath({action_name: 'exportTestResultsToExcel'})} className={exportToExcelClasses}>
							<i className="testing__export-to-excel-icon icon fa fa-file-excel-o"></i>
							<span>Экспорт в excel</span>
						</a>
					</div>
					<strong className="testing__description">Результаты тестирования</strong>
					<div className="table-list testing-list">
						<span className={tableDescrClasses}>Нет результатов тестирования</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.testingList.map((item, index) => {
									return <TestingItem key={index} {...item} thresholds={this.props.thresholds} thresholdColors={this.props.thresholdColors}/>
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