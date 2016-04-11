import React from 'react';
import cx from 'classnames';

import './style/compose-label.scss';

class ComposeLabel extends React.Component {

    static propsTypes = {
        onIconClick: React.PropTypes.func,
        label: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        labelClassName: React.PropTypes.string,
        prevIconClassName: React.PropTypes.string,
        postIconClassName: React.PropTypes.string
    }

    render() {
        const classes = cx('compose-label', this.props.className);
        const labelClasses = cx('compose-label__label', this.props.labelClassName);
        const prevIconClasses = cx({
            'compose-label__prev-icon': true
        }, this.props.prevIconClassName);
        const postIconClasses = cx({
            'compose-label__post-icon': true
        }, this.props.postIconClassName);
        return (
            <span className={classes}>
                <i onClick={this.props.onIconClick} className={prevIconClasses}></i>
                <span className={labelClasses}>{this.props.label}</span>
                <i onClick={this.props.onIconClick} className={postIconClasses}></i>
            </span>
        );
    }
};
export default ComposeLabel;
