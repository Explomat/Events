import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

class Portal extends Component {
  
  static propTypes = {
  	node: PropTypes.any,
    nodeId: PropTypes.string,
    nodeClass: PropTypes.string,
  	className: PropTypes.string
  };
  
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    let {node, nodeId, nodeClass} = this.props;
    let nodeById = document.getElementById(nodeId);
    let nodeByClass = document.getElementsByClassName(nodeClass)[0];

    let newNode = node ? node : nodeId ? nodeById : nodeClass ? nodeByClass : null;
    if (newNode){
      this.node = newNode;
    }
    else {
      this.node = document.createElement('div');
      document.body.appendChild(this.node);
    }
  }
  
  render() {
    return <div />;
  }
  
  componentDidUpdate() {
  	let newObj = { children: this.props.children, className: this.props.className }
    ReactDOM.render(
      <div
        {...newObj}
        />,
      this.node
    );
  }
  
  componentWillUnmout() {
    document.body.removeChild(this.node);
  }
}


export default Portal;