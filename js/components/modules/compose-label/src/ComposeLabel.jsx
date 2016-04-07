import React from 'react';
import cx from 'classnames';

import './style/compose-label.scss';

class ComposeLabel extends React.Component {

    static propsTypes = {
        onIconClick: React.PropTypes.func,
        label: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        iconClassName: React.PropTypes.string
    }

    render() {
        const classes = cx('compose-label', this.props.className);
        const iconClasses = cx({
            'compose-label__icon': true,
            'fa fa-remove': this.props.iconClassName === undefined
        }, this.props.iconClassName);
        return (
            <span className={classes}>
                <span className="compose-label__label">{this.props.label}</span>
                <i onClick={this.props.onIconClick} className={iconClasses}></i>
            </span>
        );
    }
};
export default ComposeLabel;
