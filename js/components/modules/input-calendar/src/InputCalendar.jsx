var React = require('react');
var InputMoment = require('../../input-moment')
var cx = require('classnames');
var clickOutSide = require('react-onclickoutside');
require('./style/input-calendar.scss');

module.exports = React.createClass({
  displayName: 'InputCalendar',

  mixins: [clickOutSide],

  propTypes: {
    className: React.PropTypes.string,
    moment: React.PropTypes.object,
    onChange: React.PropTypes.func,
    onSave: React.PropTypes.func,
    prevMonthIcon: React.PropTypes.string,
    nextMonthIcon: React.PropTypes.string
  },

  getInitialState: function(){
    return {
      isShow: false
    }
  },

  handleToogle: function(){
    this.setState({isShow: !this.state.isShow});
  },

  handleClickOutside: function() {
    this.setState({isShow: false});
  },

  render: function() {
    return (
      <div className={cx('input-calendar', this.props.className)}>
        <input onClick={this.handleToogle} type="text" className="input-calendar__date" value={this.props.moment.format('llll')} readOnly/>
        <div className={cx({'input-calendar__calendar': true, 'input-calendar__calendar--show': this.state.isShow})}>
          <InputMoment 
            moment={this.props.moment} 
            onChange={this.props.onChange} 
            onSave={this.props.onSave} 
            prevMonthIcon={this.props.prevMonthIcon}
            nextMonthIcon={this.props.nextMonthIcon}
          />
        </div>
      </div>
    );
  }
});
