import React from 'react';
import TreeNode from './TreeNode';

import './style/tree.scss';

class Tree extends React.Component {

	constructor(props){
		super(props);

		this.handleSave = this.handleSave.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.onSelect = this.onSelect.bind(this);
	}

	state = {
		data: {}
	}

	static defaultProps = {
		isExpand: false,
		isExpandAll: false,
		isShow: false,
		title: ' '
	}

	componentDidMount(){
		this.setState({data: this.props.data});
	}

	handleClose(){
		if (this.props.onClose)
			this.props.onClose();
	}

	handleSave(){
		var data = this.state.selected ? this.state.selected.props.data : null;
		if (this.props.onSave)
			this.props.onSave(data);
	}

	handleClick(){
		var out = this.state.selected ? this.state.selected.props.data : '';
		if (this.props.onClick)
			this.props.onClick(out);
	}

	selectNode(node) {
		var isSelected = node.state.selected ? false : true;
		var selectedNode = isSelected ? node : null;
		this.setState({selected: selectedNode});
        node.setState({selected: isSelected});
	}

	onSelect (node) {
        if (this.state.selected && this.state.selected._isMounted) 
            this.state.selected.setState({selected: false});
        	this.selectNode(node);
        if (this.props.onCategorySelect) 
            this.props.onCategorySelect(node.props.data);
    }

    render() {
    	if (!this.props.isShow) {
    		return null;
    	}
        return (
        	<div className="tree">
        		<div className="tree__modal-box">
        			<div className="tree__content">
		        		<div className="tree__header">
				        	<button type="button" className="close-btn" onClick={this.handleClose}>&times;</button>
							<span>{this.props.title}</span>
				        </div>
				        <div className="tree__body clearfix">
		                    <ul className="category-tree">
		                    	{this.props.data.map(tree => {
						    		return (<TreeNode 
						    			key={tree.id} 
		                          		data={tree} 
		                          		onCategorySelect={this.onSelect} 
		                          		isExpand={this.props.isExpand}
		                          		isExpandAll={this.props.isExpandAll}
		                          		selectedNode={this.props.selectedNode}/>);
						    	})}
		                    </ul>
			        	</div>
			        	<div className="tree__footer">
			        		<button type="button" className="event-btn event-btn--reverse" onClick={this.handleSave}>Сохранить</button>
				        </div>
				    </div>
			    </div>
	        </div>
        );
    }
};
export default Tree;
