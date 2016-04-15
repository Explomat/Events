import React from 'react';
import SelectedItems from './SelectedItems';
import Items from './Items';
import Filters from './Filters';
import Ajax from '../../../../utils/Ajax';
import {some} from 'lodash';
import cx from 'classnames';
import './style/select-items.scss';

/*var items = {
	headerCols: [{ name: 'a', type: 'integer' }],
	items: [
		{ id: '1', data: {fullname: '1'} },
		{ id: '2', data: {fullname: '2'} },
		{ id: '3', data: {fullname: '3'} },
		{ id: '4', data: {fullname: '4'} }
	]
}*/

class SelectItems extends React.Component {
	
	constructor(props){
		super(props);
		this.types = {'integer': 'integer', 'date': 'date'};
		this.errors = { MAX_SELECTED_ITEMS: `Вы не можете выбрать более ${this.props.maxSelectedItems} элемента(ов)` };

		this.onSort = this.onSort.bind(this);
		this.onAddItem = this.onAddItem.bind(this);
		this.onRemoveItem = this.onRemoveItem.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleChangeSearch = this.handleChangeSearch.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this._setData = this._setData.bind(this);
		this._castType = this._castType.bind(this);
		this.handleCloseError = this.handleCloseError.bind(this);
	} 

	static childContextTypes = {
		onSort: React.PropTypes.func,
		onAddItem: React.PropTypes.func,
		onRemoveItem: React.PropTypes.func
	}

    getChildContext(){
    	return {
    		onSort: this.onSort,
    		onAddItem: this.onAddItem,
    		onRemoveItem: this.onRemoveItem
    	};
  	}

	static propTypes = {
		items: React.PropTypes.array,
		selectedItems: React.PropTypes.array,
		maxSelectedItems: React.PropTypes.number,
		query: React.PropTypes.string,
		title: React.PropTypes.string,
		onClose: React.PropTypes.func,
		onSave: React.PropTypes.func
	}

	state = {
		headerCols: this.props.headerCols || [],
		items: this.props.items || [],
		selectedItems: this.props.selectedItems || [],
		maxSelectedItems: Number.MAX_VALUE,
		search: '',
		page: 1,
		pagesCount: 1,
		isLoading: true,
		error: '',
		isShowError: false
	}

	static defaultProps = {
		title: '',
		isDisplay: false
	}

	componentDidMount(){
		var self = this;
		/*var _items = items.items.map(item => {
			Object.keys(item.data).forEach((col, index) => {
				item.data[col] = self._castType(item.data[col], items.headerCols[index].type);
			})
			return {
				id: item.id,
				data: item.data
			}
		});
		this.setState({items: _items, headerCols: items.headerCols, isLoading: false});*/
		this._getData(this.props.query, this.state.page, this.state.search).then(data => {
			self._setData(data);
		});
	}

	_castType(val, type){

		function isInteger(val) {
			return isNaN(parseInt(val)) === false;
		}

		function isDate(val){
			return Date.parse(val) !== isNaN(val);
		}

		if (val === undefined || val === null || !(type in this.types)) return val.toString();
		switch(type) {
			case this.types.integer:
				if (isInteger(val) === true){
					return Number(val);
				}
				break;
			case this.types.date:
				if (isDate(val) === true){
					return new Date(val);
				}
				break;
			default:
				return val.toString();
		}
	}

	_getData(query, page, search){
		return Ajax.sendRequest(query + '&page=' + page + '&search=' + search).then(_items => {
			return JSON.parse(_items);
		}).catch(function(){
			return [];
		});
	}

	_setData(data){
		var self = this;
		if (!data || !data.items || !data.headerCols) return;
		data.items = data.items.map(item => {
			Object.keys(item.data).forEach((col, index) => {
				item.data[col] = self._castType(item.data[col], data.headerCols[index].type);
			})
			return item;
		});
		this.setState({items: data.items, headerCols: data.headerCols, pagesCount: data.pagesCount, isLoading: false});
	}

	onSort(index, isAscending){
		function getFieldByIndex(data, index){
			var keys = Object.keys(data).filter((key, _index) => {
				return index === _index;
			});
			return keys.length > 0 ? data[keys[0]] : null;
		}

		var isAsc = isAscending ? 1 : -1;
		var items = this.state.items;
		items.sort((first, second) => {
			var firstField = getFieldByIndex(first.data, index);
			var secondFiled = getFieldByIndex(second.data, index);
			if (firstField && secondFiled){
				return firstField > secondFiled ? isAsc : firstField === secondFiled ? 0 : -(isAsc);
			}
			return 0;
		});
		this.setState({items: items});
	}

	onAddItem(item){
		var _items = this.state.items;
		var _selectedItems = this.state.selectedItems;

		if (_selectedItems.length >= this.props.maxSelectedItems){
			this.setState({error: this.errors.MAX_SELECTED_ITEMS, isShowError: true});
			return;
		}
		if (some(_selectedItems, {id: item.id})) return;
		_selectedItems.push({...item});
		this.setState({ items: _items, selectedItems: _selectedItems});
	}

	onRemoveItem(id){
		var _selectedItems = this.state.selectedItems;

		_selectedItems = _selectedItems.filter(r => {
			return r.id !== id;
		});
		this.setState({ selectedItems: _selectedItems });
	}

	handleClose(){
		if (this.props.onClose){
			this.props.onClose();
		}
	}

	handleSave(){
		if (this.props.onSave){
			this.props.onSave(this.state.selectedItems);
		}
	}

	handleChangeSearch(search){
		var self = this;
		this.setState({search: search, isLoading: true, page: 1});
		this._getData(this.props.query, 1, search).then(data => {
			self._setData(data);
		});
	}

	handleChangePage(page){
		var self = this;
		this.setState({page: page, isLoading: true});
		this._getData(this.props.query, page, this.state.search).then(data => {
			self._setData(data);
		});
	}

	handleCloseError(){
		this.setState({error: '', isShowError: false});
	}

	render() {
		var errorClass = cx({
			'alert': true,
			'alert--info': true,
			'select-item__error': true,
			'select-item__error--show': this.state.isShowError
		});
		return (
			<div className="select-items">
				<div className="select-items__modal-box">
					<div className="select-items__content">
						<div className="select-item__header">
							<button type="button" className="close-btn" onClick={this.handleClose}>&times;</button>
							<span>{this.props.title}</span>
						</div>
						<div className="select-item__body clearfix">
							<Filters 
								page={this.state.page} 
								pagesCount={this.state.pagesCount}
								search={this.state.search} 
								onSearch={this.handleChangeSearch}
								onPage={this.handleChangePage}/>
							<Items items={this.state.items} selectedItems={this.state.selectedItems} headerCols={this.state.headerCols} isLoading={this.state.isLoading}/>
							<SelectedItems items = {this.state.selectedItems} />
						</div>
						<div className="select-item__footer">
							<div className={errorClass}>
								<button type="button" className="close-btn" onClick={this.handleCloseError}>&times;</button>
								<span>{this.state.error}</span>
							</div>
							<button type="button" className="event-btn event-btn--reverse" onClick={this.handleSave}>Сохранить</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
};
export default SelectItems;