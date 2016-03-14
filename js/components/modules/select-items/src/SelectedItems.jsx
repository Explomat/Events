import React from 'react';

class SelectedItem extends React.Component { 

	constructor(props){
		super(props);
		this.handleRemoveItem = this.handleRemoveItem.bind(this);
	}

	static contextTypes = {
		onRemoveItem: React.PropTypes.func
	}

	static propTypes = {
		id: React.PropTypes.string, 
		data: React.PropTypes.object
	}

	handleRemoveItem(){
		if (this.context.onRemoveItem){
			this.context.onRemoveItem(this.props.id, this.props.data);
		}
	}

	_getFirstField() {
		return Object.keys(this.props.data).filter((key, index) => {
			return index === 0;
		}).map(key => { return this.props.data[key] })
	}

	render(){
		return(
			<div className="item">
				<button className="item__button event-btn" onClick={this.handleRemoveItem}>
					<i className="fa fa-minus"></i>
				</button>
				<label className="item__text">{this._getFirstField()}</label>
			</div>
		);
	}
};

class SelectedItems extends React.Component { 

	static propTypes = {
		items: React.PropTypes.array //[{id:'', cols: [{}, ...]}, ...]
	}

	static defaultProps = {
		items: []
	}

	getItemsMarkup(){
		return this.props.items.map((item, index) => {
			return <SelectedItem key={index} {...item}/>
		});
	}

	render() {
		return(
			<div className="selected-items">
				{this.getItemsMarkup()}
			</div>
		);
	}
};

export default SelectedItems;