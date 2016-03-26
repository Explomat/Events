var React = require('react');

require('./style/text-overflow.scss');

var TextOverflow = React.createClass({

	_changeDisplayDots: function(){
		if (this.refs.overflowText.offsetHeight > this.refs.overflowParent.offsetHeight) {
		  this.setState({isDisplayDots: true});
		}
		else this.setState({isDisplayDots: false});
	},

	propsTypes: {
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		rowsCount: React.PropTypes.number,
		className: React.PropTypes.string 
	},

	getDefaultProps: function(){
		rowsCount: 1
	},

	componentDidUpdate: function(){
		this._changeDisplayDots();
	},

	shouldComponentUpdate: function(nextProps, nextState){
		return (nextProps.value !== this.props.value || nextState.isDisplayDots !== this.state.isDisplayDots);
	},

	componentDidMount: function(){
		this._changeDisplayDots();	
	},

	getInitialState: function(){
		return {
			isDisplayDots: false
		}
	},

	render: function() {
		var rowsCountClass = "text-overflow-box--" + this.props.rowsCount;
		var className = this.props.className ? this.props.className : '';
		var isDisplayDots = this.state.isDisplayDots ? "text-overflow-box__dots--show" : "";
		return (
			<div ref="overflowParent" className={"text-overflow-box " + rowsCountClass + " " + className}>
				<p ref="overflowText" title={this.props.value} className="text-overflow-box__text">{this.props.value}</p>
				<span className={"text-overflow-box__dots " + isDisplayDots}>...</span>
			</div>
			
		);
	}
});

module.exports = TextOverflow;