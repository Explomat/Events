import React from 'react';
import cx from 'classnames';

class TreeDescr extends React.Component {
	render() {
		if (this.props.description) {
			return <label className="description-map">
				<span className="description-map__title"> ({this.props.description})</span>
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
		children: [],
		isExpand: this.props.isExpand || false
	}

	componentDidMount(){
		if (this.props.selectedNode && (this.props.selectedNode.id == this.props.data.id) && this.props.onCategorySelect)
			this.props.onCategorySelect(this);
		/*if (this.props.data.selected === true)
			this.props.onCategorySelect(this);*/
		if (this.props.isExpand || this.props.isExpandAll)
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

	expandNodes() {
		let isExpand = this.props.isExpandAll ? true : false;
		if (this.props.data.children) {
	        if (this.state.children && this.state.children.length) 
	            this.setState({children: null, isExpand: isExpand});
	        else 
	            this.setState({children: this.props.data.children, isExpand: isExpand});
	    }
	}

	onChildDisplayToggle(ev) {
		this.expandNodes();
	    ev.preventDefault();
	    ev.stopPropagation();
	}

	_geTtitle(){
		return `${this.props.data.name} (${this.props.data.descr})`;
	}

	render() {
	    if (!this.state.children) this.state.children = [];
	    let classes = cx({
	    	'item': true,
	        'item--selected': (this.state.selected ? true : false)
	    });
	    let iconClasses = cx({
	    	'item__icon': true,
	    	'icon-plus': this.props.data.children,
	    	'icon-minus': this.props.data.children && this.state.children.length
	    });
	    return (
	        <li className={classes}>
	            <a title={this._geTtitle()} onClick={this.onCategorySelect} className="item__description">
	            	<i className={iconClasses} onClick={this.onChildDisplayToggle}></i>
	                <span>{this.props.data.name}</span>
	                <TreeDescr description={this.props.data.descr}/>
	            </a>
	            <ul className="item__list">
	                {this.state.children.map(child => {
	                    return <TreeNode key={child.id} 
	                            data={child} 
	                            onCategorySelect={this.props.onCategorySelect}
	                            isExpand={this.state.isExpand}
	                            selectedNode={this.props.selectedNode ? this.props.selectedNode : null}/>;
	                })}
	            </ul>
	        </li>
	    );
	}
};

export default TreeNode;