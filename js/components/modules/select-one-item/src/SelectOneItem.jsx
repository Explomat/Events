import React from 'react';
import SelectItems from '../../select-items';
import cx from 'classnames';
import {merge} from 'lodash';
import './style/select-one-item.scss';

class SelectOneItem extends React.Component {

	constructor(props){
		super(props);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	static propTypes = {
		modalTitle: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		query: React.PropTypes.string,
		onChange: React.PropTypes.func,
		selectedItem: React.PropTypes.object
	};

	state = {
		isShowModal: false, 
		selectedItem: this.props.selectedItem
	}

	componentWillReceiveProps(nextProps){
		this.setState({selectedItem: nextProps.selectedItem});
	}

	getModal(){
		let selectedItem = this.state.selectedItem ? [this.state.selectedItem] : null;
		return this.state.isShowModal ? 
			<SelectItems
				title={this.props.modalTitle}
				selectedItems={selectedItem}
				maxSelectedItems={1}
				query={this.props.query}
				onClose={this.handleCloseModal} 
				onSave={this.handleSave}/> : null;
	}

	getItemValue(){
		let data = this.props.selectedItem ? this.props.selectedItem.data: null;
		return data ? data[Object.keys(data)[0]] : '';
	}

	handleSave(items) {
		let item = null;
		if (items.length === 1){
			item = items[0];
		}
		if (this.props.onChange){
			this.props.onChange(item);
		}
		this.handleCloseModal();
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

	handleShowModal(){
		this.setState({isShowModal: true});
	}

	render() {
		let inputClasses = cx({
			'select-one-item__input': true,
			'select-one-item__input_not-empty': this.props.selectedItem
		});
		let iconClasses = cx({
			'fa fa-plus-circle': !this.props.selectedItem,
			'fa fa-minus-circle': this.props.selectedItem,
			'select-one-item__icon': true,
			'select-one-item__icon--up': this.props.selectedItem
		});
		return (
			<div className={cx('select-one-item', this.props.className)}>
				<input
					readOnly 
					className={inputClasses} 
					type="text" 
					value={this.getItemValue()}
					onClick={this.handleShowModal} 
					onChange={this.handleChange}/>
                <label className="select-one-item__label">{this.props.placeholder}</label>
                <i className={iconClasses}></i>
                {this.getModal()}
			</div>
		);
	}
};

export default SelectOneItem;