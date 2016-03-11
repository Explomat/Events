var React = require('react');

var SelectedItem = React.createClass({

	contextTypes: {
		onRemoveItem: React.PropTypes.func
	},

	propTypes: {
		id: React.PropTypes.string, 
		data: React.PropTypes.object
	},

	handleRemoveItem(){
		if (this.context.onRemoveItem){
			this.context.onRemoveItem(this.props.id, this.props.data);
		}
	},

	_getFirstField() {
		return Object.keys(this.props.data).filter((key, index) => {
			return index === 0;
		}).map(key => { return this.props.data[key] })
	},

	render: function(){
		return(
			<div className="selected-items__item">
				<label>{this._getFirstField()}</label>
				<button onClick={this.handleRemoveItem}>-</button>
			</div>
		);
	}
});

var SelectedItems = React.createClass({

	propTypes: {
		items: React.PropTypes.array //[{id:'', cols: [{}, ...]}, ...]
	},

	getDefaultProps(){
		return {
			items: []
		}
	},

	getItemsMarkup(){
		return this.props.items.map(function(item, index){
			return <SelectedItem key={index} {...item}/>
		});
	},

	render() {
		return(
			<div className="selected-items">
				{this.getItemsMarkup()}
			</div>
		);
	}
});

module.exports = SelectedItems;