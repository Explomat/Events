var React = require('react');
var assign = require('lodash/assign');

require('./style/text-label.scss');

var TextBase = {

	propTypes: {
		className: React.PropTypes.string,
		inputClassName: React.PropTypes.string,
		focused: React.PropTypes.bool,
		onChange: React.PropTypes.func, 
		onBlur: React.PropTypes.func,
		onClick: React.PropTypes.func,
		isValid: React.PropTypes.func,
		notValidClass: React.PropTypes.string,
		readOnly: React.PropTypes.bool
	},

	getDefaultProps: function() {
		return {
			value: '',
			placeholder: '',
			notValidClass: 'input-box__input--not-valid',
			isValid: function() {
				return true;
			},
			readOnly: false
		}
	},

	getInitialState: function() {
		return {
			value: this.props.value
		}
	},

	componentWillReceiveProps: function(nextProps){
		this.setState({value: nextProps.value});
	},

	componentDidMount: function(){
		if (this.props.focused){
			this.focus();
		}
	},

	focus(){
		var inpt = this.refs.inpt;
		inpt.selectionStart = inpt.selectionEnd = inpt.value.length;
		inpt.focus();
	},

	handleChange: function(e) {
		if (!this.props.isValid(e.target.value)) {
			e.target.classList.add(this.props.notValidClass);
		}
		else {
			e.target.classList.remove(this.props.notValidClass);
		}
		var val = e.target.value;
		this.setState({value: e.target.value});
		if (this.props.onChange && this.props.isValid(val)) {
			this.props.onChange(val);
		}
	},

	handleBlur: function(e){
		var val = e.target.value;
		if (!this.props.isValid(e.target.value)) {
			this.setState({value: this.props.value});
			e.target.classList.remove(this.props.notValidClass);
			val = this.props.value;
		}

		if (this.props.onBlur)
			this.props.onBlur(val);
	}
}

var TextView = React.createClass({

	mixins: [TextBase],

	handleAddtranslate: function(e){
		if (!e.target.classList.contains('input-box__label_translate')){
			e.target.classList.add('input-box__label_translate');
			this.refs.inpt.focus();
		}
	},

	handleDetranslate: function(){
		this.refs.lbl.classList.remove('input-box__label_translate');
		this.refs.lbl.classList.add('input-box__label_detranslate');
	},

	render: function() {
		var isNotEmptyClass = this.state.value === '' ? '' : 'input-box__input_not-empty';
		var isValidClass = !this.props.isValid(this.state.value) ? this.props.notValidClass : '';
		var className = this.props.className ? this.props.className : '';
		var inputClassName = this.props.inputClassName ? this.props.inputClassName : '';
		return (
			<div className={"input-box " + className} tabIndex={1} onBlur={this.handleDetranslate}>
				<input 
					ref="inpt" 
					type="text" 
					value={this.state.value} 
					className={"input-box__input " + isNotEmptyClass + " " + isValidClass + " " + inputClassName} 
					onChange={this.handleChange} 
					onBlur={this.handleBlur} 
					onClick={this.props.onClick}
					readOnly={this.props.readOnly}/>
                <label ref="lbl" onClick={this.handleAddtranslate} className="input-box__label">{this.props.placeholder}</label>
			</div>
		);
	}
});

var TextAreaView = React.createClass(assign({}, TextBase, {

	componentWillReceiveProps: function(nextProps){
		this.setState({value: nextProps.value});
		this._setHeight();
	},

	_setHeight(){
		setTimeout(function(){
			this.setState({height: this.refs.hiddenBlock.offsetHeight});
		}.bind(this), 0);
	},

	handleChange: function(e){
		TextBase.handleChange.call(this, e);
		this._setHeight();
	},

	handleAddtranslate: function(e){
		if (!e.target.classList.contains('textarea-box__label_translate')){
			e.target.classList.add('textarea-box__label_translate');
		}
	},

	handleDetranslate: function(){
		this.refs.lbl.classList.remove('textarea-box__label_translate');
		this.refs.lbl.classList.add('textarea-box__label_detranslate');
	},

	componentDidMount: function(){
		TextBase.componentDidMount.call(this);
		this.setState({height: this.refs.hiddenBlock.offsetHeight});
	},

	getInitialState: function(){
		var baseObject = TextBase.getInitialState.call(this);
		baseObject.height = 0;
		return baseObject;
	},

	render: function() {
		var isNotEmptyClass = this.state.value === '' ? '' : 'textarea-box__input_not-empty';
		var isValidClass = !this.props.isValid(this.state.value) ? this.validClass : '';
		var textAreaStyle = { height: this.state.height + 'px' };
		var className = this.props.className ? this.props.className : '';
		return (
			<div className={"textarea-box " + className} tabIndex={1} onBlur={this.handleDetranslate}>
				<textarea 
					ref="inpt" 
					style={textAreaStyle} 
					className={"textarea-box__input " + isNotEmptyClass + " " + isValidClass} 
					rows={this.props.rows || 1} 
					value={this.state.value} 
					onChange={this.handleChange} 
					onKeyDown={this.handleKeyDown} 
					onBlur={this.handleBlur} 
					readOnly={this.props.readOnly}>
				</textarea>
                <label ref="lbl" onClick={this.handleAddtranslate} className="textarea-box__label">{this.props.placeholder}</label>
				<div ref="hiddenBlock" className="textarea-box__hidden-block">{this.state.value}</div>
			</div>
			
		);
	}
}));

module.exports = {
	TextBase: TextBase,
	TextView: TextView,
	TextAreaView: TextAreaView
}