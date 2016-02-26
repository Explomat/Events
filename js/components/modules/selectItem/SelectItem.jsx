var React = require('react');
//var Ajax = require('../../utils/Ajax');

var items = {
	headerCols: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string'}, { name: 'c', type: 'string' }],
	rows: [
		{ id: 1, cols: ['Матвеев Савва Янович', 'должность_должность', 'подразделение_подразделение']},
		{ id: 2, cols: ['Габдуллин Дамир Габдульбариевич', 'Группа дистанционного обучения', 'Руководитель группы']}
	]
}

var HeaderCol = React.createClass({

	contextTypes: {
		onSort: React.PropTypes.func
	},

	propTypes: {
		name: React.PropTypes.string,
		type: React.PropTypes.string,
		onSort: React.PropTypes.func
	},

	getInitialState: function(){
		return {
			isRotate: false
		}
	},

	getDefaultProps: function(){
		return {
			name: ''
		}
	},

	handleSort: function(){
		if (this.context.onSort) {
			this.context.onSort(this.props.index, this.state.isRotate);
			this.setState({isRotate: !this.state.isRotate});
		}
	},

	render: function(){
		var caretClassName = this.state.isRotate ? "rotate" : "";
		return(
			<th onClick={this.handleSort}>
				<span className="header-row__col-name">{this.props.name}</span>
				<span className={"caret " + caretClassName}></span>
			</th>
		);
	}
});

var Row = React.createClass({

	contextTypes: {
		onAddItem: React.PropTypes.func
	},

	propTypes: {
		cols: React.PropTypes.array
	},

	getDefaultProps: function(){
		return {
			cols: []
		}
	},

	handleAddItem: function(){
		if (this.context.onAddItem){
			this.context.onAddItem(this.props.id, this.props.cols);
		}
	},

	getMarkup: function(){
		var cols = this.props.cols;
		return (
			<tr className="body-row">
				<td>
					<button onClick={this.handleAddItem}>+</button>
				</td>
				{cols.map(function(c, index){
					return <td key={index} className="body-row__col">{c}</td>
				})}
			</tr>
		);
	},

	render: function(){
		return this.getMarkup();
	}
});

var Items = React.createClass({

	propTypes: {
		headerCols: React.PropTypes.array.isRequired,
		rows: React.PropTypes.array.isRequired
	},

	getColsMarkup: function(){
		var headerCols = this.props.headerCols;
		var markUpCols = [<th key={0}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>];
		headerCols.forEach(function(c, index){
			markUpCols.push(<HeaderCol key={index + 1} name={c.name} index={index}/>);
		});
		return markUpCols;
	},

	getRowsMarkUp: function(){
		var rows = this.props.rows;
		return rows.map(function(r, index){
			return <Row key={index} id={r.id} cols={r.cols} />
		});
	},

	render: function() {
		var cols = this.getColsMarkup();
		var rows = this.getRowsMarkUp();
		return(
			<table className="items">
				<thead className="items__header">
					<tr className="header-row">{cols}</tr>
				</thead>
				<tbody className="items__body">
					{rows}
				</tbody>
			</table>
		);
	}
});

var SelectedItem = React.createClass({

	contextTypes: {
		onRemoveItem: React.PropTypes.func
	},

	propTypes: {
		id: React.PropTypes.string, 
		cols: React.PropTypes.array
	},

	handleRemoveItem: function(){
		if (this.context.onRemoveItem){
			this.context.onRemoveItem(this.props.id, this.props.cols);
		}
	},

	render: function(){
		return(
			<div>
				<label>{this.props.cols[0]}</label>
				<button onClick={this.handleRemoveItem}>-</button>
			</div>
		);
	}
});

var SelectedItems = React.createClass({

	propTypes: {
		items: React.PropTypes.array //[{id:'', cols: [{}, ...]}, ...]
	},

	getDefaultProps: function(){
		return {
			items: []
		}
	},

	getItemsMarkup: function(){
		return this.props.items.map(function(item, index){
			return <SelectedItem key={index} {...item}/>
		});
	},

	render: function() {
		return(
			<div className="selected-items">
				{this.getItemsMarkup()}
			</div>
		);
	}
});

var SelectItem = React.createClass({

	childContextTypes: {
		onSort: React.PropTypes.func,
		onAddItem: React.PropTypes.func,
		onRemoveItem: React.PropTypes.func
	},

    getChildContext: function() {
    	return {
    		onSort: this.onSort,
    		onAddItem: this.onAddItem,
    		onRemoveItem: this.onRemoveItem
    	};
  	},

	propTypes: {
		items: React.PropTypes.object,
		selectedItems: React.PropTypes.array,
		query: React.PropTypes.string,
		title: React.PropTypes.string
	},

	types: {'integer': 'integer', 'string': 'string', 'boolean': 'boolean', 'date': 'date'},

	_castType: function(val, type){

		function isInteger(val) {
			return /\d+/.test(val);
		}

		function isBoolean(val){
			return val === 'true' || val === 'false';
		}

		function isDate(val){
			return Date.parse(val) !== isNaN(val);
		}

		if (val === undefined || val === null || !(type in this.types)) return val.toString();
		switch(type) {
			case this.types.integer:
				if (isInteger(val))
					return Number(val);
			case this.types.boolean:
				if (isBoolean(val))
					return val === 'true' ? true : false;
			case this.types.date:
				if (isDate(val))
					return new Date(val);
			default:
				return val.toString();
		}
	},

	_filterItems: function(items, selectedItems) {
		if (selectedItems.length === 0) return items;

		function isContains(items, item) {
			for (var i = items.length - 1; i >= 0; i--) {
				if (items[i].id === item.id) return true;
			};
			return false;
		}

		return items.filter(function(i, index){
			return !isContains(selectedItems, i);
		});
	},

	_getItems: function(page){
		Ajax.sendRequest(query + '&page=' + page).then(function(_items){
			var items = JSON.parse(_items);

			items.rows = items.rows.map(function(r){
				var cols = r.cols.map(function(c, index){
					return this._castType(c, items.headerCols[index].type);
				}.bind(this));
				return {
					id: r.id,
					cols: cols
				}
			}.bind(this));

			items.rows = this._filterItems(items.rows, this.state.selectedItems);
			return items;
		}).catch(function(err){
			return [];
		});
	},

	onSort: function(index, isAscending){
		var isAsc = isAscending ? 1 : -1;
		var rows = this.state.items.rows;
		rows.sort(function(first, second){
			return first[index] > second[index] ? isAsc : first[index] === second[index] ? 0 : -(isAsc);
		});
		this.setState({items: items});
	},

	onAddItem: function(id, cols){
		var items = this.state.items;
		var selectedItems = this.state.selectedItems;
		selectedItems.push({ id: id, cols: cols });

		items.rows = items.rows.filter(function(r){
			return r.id !== id;
		});
		this.setState({ items: items, selectedItems: selectedItems});
	},

	onRemoveItem: function(id, cols){
		var items = this.state.items;
		var selectedItems = this.state.selectedItems;
		items.rows.push({ id: id, cols: cols });

		selectedItems = selectedItems.filter(function(r){
			return r.id !== id;
		});
		this.setState({ items: items, selectedItems: selectedItems});
	},

	componentDidMount: function(){
		/*this._getItems(this.state.page).then(function(items){
			this.setState({items: items});
		}.bind(this))*/
		items.rows = items.rows.map(function(r){
			var cols = r.cols.map(function(c, index){
				return this._castType(c, items.headerCols[index].type);
			}.bind(this));
			return {
				id: r.id,
				cols: cols
			}
		}.bind(this));
		items.rows = this._filterItems(items.rows, this.state.selectedItems);
		this.setState({items: items});
	},

	getInitialState: function() {
		return {
			items: this.props.items,
			selectedItems: this.props.selectedItems,
			page: 1
		}
	},

	getDefaultProps: function(){
		return {
			items: { headerCols: [], rows: [] },
			selectedItems: [],
			title: ' '
		}
	},

	render: function() {
		return (
			<div className="select-item modal-box" style={{display: "block"}}>
				<div className="select-item__modal-box modal-box__dialog">
					<div className="modal-box__content">
						<div className="select-item__header modal-box__header">
							<button type="button" className="close-btn" onClick={this.handleClose}>&times;</button>
							<span>{this.props.title}</span>
						</div>
						<div className="select-item__body modal-box__body clearfix">
							<Items {...this.state.items} />
							<SelectedItems items = {this.state.selectedItems} />
						</div>
						<div className="select-item__footer modal-box__footer">
							<button type="button" className="event-btn event-btn--reverse" onClick={this.handleSave}>Сохранить</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SelectItem;