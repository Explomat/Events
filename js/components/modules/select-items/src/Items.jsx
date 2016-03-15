import React from 'react';
import {some} from 'lodash';
import cx from 'classnames';

class HeaderCol extends React.Component {

	constructor(props){
		super(props);
		this.handleSort = this.handleSort.bind(this);
	} 	

	static contextTypes = {
		onSort: React.PropTypes.func
	}

	static propTypes = {
		name: React.PropTypes.string,
		type: React.PropTypes.string,
		onSort: React.PropTypes.func
	}
	state = {
		isRotate: false
	}

	static defaultProps = {
		name: ''
	}

	handleSort(){
		if (this.context.onSort) {
			this.context.onSort(this.props.index, this.state.isRotate);
			this.setState({isRotate: !this.state.isRotate});
		}
	}

	render(){
		var caretClassName = this.state.isRotate ? "rotate" : "";
		return(
			<th onClick={this.handleSort} className="header-row__col">
				<span className="header-row__col-name">{this.props.name}</span>
				<span className={"caret " + caretClassName}></span>
			</th>
		);
	}
};

class Item extends React.Component {

	constructor(props){
		super(props);
		this.handleAddItem = this.handleAddItem.bind(this);
	} 	

	static contextTypes = {
		onAddItem: React.PropTypes.func
	}

	static propTypes = {
		data: React.PropTypes.object,
		isSelected: React.PropTypes.bool
	}

	static defaultProps = {
		data: {},
		isSelected: false
	}

	handleAddItem(){
		if (this.context.onAddItem){
			this.context.onAddItem(this.props.id, this.props.data);
		}
	}

	getMarkup(){
		var data = this.props.data;
		var classesButton = cx({
			'body-row__add-btn': true,
			'event-btn': !this.props.isSelected,
			'body-row__add-btn--selected': this.props.isSelected
		});
		var classesIcon = cx({
			'fa fa-plus': !this.props.isSelected,
			'fa fa-check': this.props.isSelected
		});
		return (
			<tr className="body-row" onClick={this.handleAddItem}>
				<td>
					<button className={classesButton}>
						<i className={classesIcon}></i>
					</button>
				</td>
				{Object.keys(data).map((c, index) => {
					return <td key={index} className="body-row__col oneline">{data[c]}</td>
				})}
			</tr>
		);
	}

	render(){
		return this.getMarkup();
	}
};

class Items extends React.Component { 	

	static propTypes = {
		headerCols: React.PropTypes.array,
		items: React.PropTypes.array,
		selectedItems: React.PropTypes.array
	}

	static defaultProps = {
		headerCols: [],
		items: [],
		selectedItems: []
	}

	getColsMarkup(){
		let headerCols = this.props.headerCols;
		let markUpCols = [<th key={0}></th>];
		headerCols.forEach((c, index) => {
			markUpCols.push(<HeaderCol key={index + 1} name={c.name} index={index}/>);
		});
		return markUpCols;
	}

	getRowsMarkUp(){
		let items = this.props.items;
		let selectedItems = this.props.selectedItems;
		return items.map((i, index) => {
			let isSelected = some(selectedItems, i);
			return <Item key={index} id={i.id} data={i.data} isSelected={isSelected}/>
		});
	}

	render() {
		let cols = this.getColsMarkup();
		let items = this.getRowsMarkUp();
		let isLoadingClass = this.props.isLoading ? 'overlay-loading--show ': '';
		return(
			<div className="items-wrapper">
				<table className="items-wrapper__header">
					<thead>
						<tr className="header-row">{cols}</tr>
					</thead>
				</table>
				<div className="items-wrapper__body">
					<table className="items">
						<tbody className="items__body">
							{items}
						</tbody>
					</table>
				</div>
				
				<div className={"overlay-loading " + isLoadingClass}></div>
			</div>
			
		);
	}
};

export default Items;