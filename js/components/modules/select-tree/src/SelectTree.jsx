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
			'select-tree__input_not-empty': this.props.selectedNode
		});
		let iconClasses = cx({
			'fa fa-plus-circle': !this.props.selectedNode,
			'fa fa-minus-circle': this.props.selectedNode,
			'select-tree__icon': true,
			'select-tree__icon--up': this.props.selectedNode
		});
        return (
        	<div className={cx('select-tree', this.props.className)}>
				<input
					readOnly 
					className={inputClasses} 
					type="text" 
					value={this.props.selectedNode.name}
					title={this.props.selectedNode.name}
					onClick={this.handleShowModal} 
					onChange={this.handleChange}/>
                <label className="select-tree__label">{this.props.placeholder}</label>
                <i className={iconClasses}></i>
                <Tree 
                	onSave={this.handleSaveModal} 
                	onClose={this.handleCloseModal} 
                	data={this.props.nodes} 
                	selectedNode={this.props.selectedNode}
                	isShow={this.state.isShowModal}
                	isExpand={this.props.isExpand}
                	isExpandAll={this.props.isExpandAll}/>
			</div>
        );
    }
};
export default SelectTree;
