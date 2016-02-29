var React = require('react');

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

module.exports = SelectedItems;