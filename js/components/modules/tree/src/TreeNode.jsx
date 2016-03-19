import React from 'react';
import cx from 'classnames';

class TreeDescr extends React.Component {
	render() {
		if (this.props.description) {
			return <label className="description-map">
				<span className="description-map_arrow">&rarr;</span>
				<span>{this.props.description.name}</span>
			</label>;
		}
		return null;
	}
};

class TreeNode extends React.Component {

	constructor(props){
		super(props);
		this._isMounted = true;
		this.onChildDisplayToggle = this.onChildDisplayToggle.bind(this);
		this.onCategorySelect = this.onCategorySelect.bind(this);
	}

	state = {
		children: []
	}

	componentDidMount(){
		/*if (this.props.selectedNode && (this.props.selectedNode.id == this.props.data.id) && (this.props.selectedNode.name == this.props.data.name) && this.props.onCategorySelect)
			this.props.onCategorySelect(this);*/
		if (this.props.data.selected === true)
			this.props.onCategorySelect(this);
		if (this.props.isExpand)
			this.expandNodes();
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	onCategorySelect(ev) {
	    if (this.props.onCategorySelect) 
	        this.props.onCategorySelect(this);
	    ev.preventDefault();
	    ev.stopPropagation();
	}

	expandNodes(_node) {
		if (this.props.data.children) {
	        if (this.state.children && this.state.children.length) 
	            this.setState({children: null});
	        else 
	            this.setState({children: this.props.data.children});
	    }
	}

	onChildDisplayToggle(ev) {
		this.expandNodes();
	    ev.preventDefault();
	    ev.stopPropagation();
	}

	render() {
	    if (!this.state.children) this.state.children = [];
	    let classes = cx({
	    	'item': true,
	        'item--selected': (this.state.selected ? true : false)
	    });
	    let iconClasses = cx({
	    	'item__icon': true,
	    	'fa fa-plus': this.props.data.children,
	    	'fa fa-minus': this.props.data.children && this.state.children.length
	    });
	    return (
	        <li className={classes}>
	            <a onClick={this.onCategorySelect} className="item__description">
	            	<i className={iconClasses} onClick={this.onChildDisplayToggle}></i>
	                <span>{this.props.data.name}</span>
	                <TreeDescr description={this.props.data.descr}/>
	            </a>
	            <ul>
	                {this.state.children.map(child => {
	                    return <TreeNode key={child.id} 
	                            data={child} 
	                            onCategorySelect={this.props.onCategorySelect}
	                            isExpand={this.props.isExpand}
	                            selectedNode={this.props.selectedNode ? this.props.selectedNode : null}/>;
	                })}
	            </ul>
	        </li>
	    );
	}
};

export default TreeNode;