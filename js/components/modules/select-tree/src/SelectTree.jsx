import React from 'react';
import Tree from '../../tree';
import cx from 'classnames';

import './style/select-tree.scss';

class SelectTree extends React.Component {

	constructor(props){
		super(props);

		this.handleSaveModal = this.handleSaveModal.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	state = {
		isShowModal: false
	}

	static propTypes = {
		selectedItem: React.PropTypes.object,
		modalTitle: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		items: React.PropTypes.array
	}

	static defaultProps = {
		
	}

	componentDidMount(){
		
	}

	handleSaveModal(item){
		this.setState({isShowModal: false});
		if (this.props.onSave)
			this.props.onSave(item);
	}

	handleShowModal(){
		this.setState({isShowModal: true});
	}

	handleCloseModal(){
		this.setState({isShowModal: false});
	}

    render() {
    	let inputClasses = cx({
			'select-tree__input': true,
			'select-tree__input_not-empty': this.props.selectedItem
		});
		let iconClasses = cx({
			'fa fa-plus-circle': !this.props.selectedItem,
			'fa fa-minus-circle': this.props.selectedItem,
			'select-tree__icon': true,
			'select-tree__icon--up': this.props.selectedItem
		});
        return (
        	<div className={cx('select-tree', this.props.className)}>
				<input
					readOnly 
					className={inputClasses} 
					type="text" 
					value={this.props.selectedItem}
					onClick={this.handleShowModal} 
					onChange={this.handleChange}/>
                <label className="select-tree__label">{this.props.placeholder}</label>
                <i className={iconClasses}></i>
                <Tree onSave={this.handleSaveModal} onClose={this.handleCloseModal} data={this.props.items} isShow={this.state.isShowModal}/>
			</div>
        );
    }
};
export default SelectTree;
