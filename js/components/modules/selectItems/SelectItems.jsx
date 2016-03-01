var React = require('react');
var SelectedItems = require('./SelectedItems');
var Items = require('./Items');
var Filters = require('./Filters');
//var Ajax = require('../../utils/Ajax');

var items = {
	headerCols: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string'}, { name: 'c', type: 'integer' }],
	rows: [
		{ id: 1, cols: ['Матвеев Савва Янович', 'должность_должность', '1']},
		{ id: 2, cols: ['Габдуллин Дамир Габдульбариевич', 'Группа дистанционного обучения', '2']}
	]
}

var SelectItems = React.createClass({

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
		title: React.PropTypes.string,
		onClose: React.PropTypes.func
	},

	types: {'integer': 'integer', 'date': 'date'},

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

	_castType: function(val, type){

		function isInteger(val) {
			return isNaN(parseInt(val)) === false;
		}

		function isDate(val){
			return Date.parse(val) !== isNaN(val);
		}

		if (val === undefined || val === null || !(type in this.types)) return val.toString();
		switch(type) {
			case this.types.integer:
				if (isInteger(val))
					return Number(val);
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
			return first.cols[index] > second.cols[index] ? isAsc : first.cols[index] === second.cols[index] ? 0 : -(isAsc);
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

	handleClose: function(){
		if (this.props.onClose){
			this.props.onClose();
		}
	},

	handleSave: function(){
		if (this.props.onSave){
			this.props.onSave(this.state.selectedItems);
		}
	},

	render: function() {
		return (
			<div className="select-items modal-box" style={{display: "block"}}>
				<div className="select-items__modal-box modal-box__dialog">
					<div className="modal-box__content">
						<div className="select-item__header modal-box__header">
							<button type="button" className="close-btn" onClick={this.handleClose}>&times;</button>
							<span>{this.props.title}</span>
						</div>
						<div className="select-item__body modal-box__body clearfix">
							<Filters />
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

module.exports = SelectItems;