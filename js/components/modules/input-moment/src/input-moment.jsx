var cx = require('classnames');
var moment = require('moment');
var React = require('react');
var Calendar = require('./calendar');
var Time = require('./time');

module.exports = React.createClass({
  displayName: 'InputMoment',

  getInitialState: function() {
    return {
      tab: 0
    };
  },

  getDefaultProps: function() {
    return {
      prevMonthIcon: 'ion-ios-arrow-left',
      nextMonthIcon: 'ion-ios-arrow-right'
    };
  },

  render: function() {
    var tab = this.state.tab;
    var m = this.props.moment;

    return (
      <div className="m-input-moment">
        <div className="options">
          <button type="button" className={cx('ion-calendar im-btn', {'is-active': tab === 0})} onClick={this.handleClickTab.bind(null, 0)}>
            Дата
          </button>
          <button type="button" className={cx('ion-clock im-btn', {'is-active': tab === 1})} onClick={this.handleClickTab.bind(null, 1)}>
            Время
          </button>
        </div>

        <div className="tabs">
          <Calendar
            className={cx('tab', {'is-active': tab === 0})}
            moment={m}
            onChange={this.props.onChange}
            prevMonthIcon={this.props.prevMonthIcon}
            nextMonthIcon={this.props.nextMonthIcon}
          />
          <Time
            className={cx('tab', {'is-active': tab === 1})}
            moment={m}
            onChange={this.props.onChange}
          />
        </div>

        <button type="button" className="im-btn btn-save ion-checkmark"
          onClick={this.handleSave}>
          Save
        </button>
      </div>
    );
  },

  handleClickTab: function(tab, e) {
    e.preventDefault();
    this.setState({tab: tab});
  },

  handleSave: function(e) {
    e.preventDefault();
    if(this.props.onSave) this.props.onSave();
  }
});
