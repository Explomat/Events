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
		modalTitle: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		nodes: React.PropTypes.array,
		selectedNode: React.PropTypes.object,
		isExpand: React.PropTypes.bool,
		isExpandAll: React.PropTypes.bool
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
    	const inputClasses = cx({
			'select-tree__input': true,
			'select-tree__input_not-empty': this.props.selectedNode
		});
		const iconClasses = cx({
			'icon-popup': true,
			'select-tree__icon': true,
			'select-tree__icon--up': this.props.selectedNode
		});
		const name = this.props.selectedNode ? this.props.selectedNode.name : null;
        return (
        	<div className={cx('select-tree-container', this.props.className)}>
	        	<div className='select-tree'>
					<input
						readOnly 
						className={inputClasses} 
						type="text" 
						value={name}
						title={name}
						onClick={this.handleShowModal} 
						onChange={this.handleChange}/>
	                <label className="select-tree__label">{this.props.placeholder}</label>
	                <i className={iconClasses} onClick={this.handleShowModal} ></i>
	            </div>
	            <Tree
                	onSave={this.handleSaveModal} 
                	onClose={this.handleCloseModal} 
                	data={this.props.nodes}
                	title={this.props.modalTitle} 
                	selectedNode={this.props.selectedNode}
                	isShow={this.state.isShowModal}
                	isExpand={this.props.isExpand}
                	isExpandAll={this.props.isExpandAll}/>
			</div>
        );
    }
};
export default SelectTree;
