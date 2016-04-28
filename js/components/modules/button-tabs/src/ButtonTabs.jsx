import React from 'react';
import cx from 'classnames';

import './style/button-tabs.scss';

export class ButtonTab extends React.Component {

    static propTypes = {
        payload: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]), 
        value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        onClick: React.PropTypes.func,
        selected: React.PropTypes.bool,
        className: React.PropTypes.string
    }

    static defaultProps = {
        selected: false
    }

    handleClick(){
        if (this.props.onClick){
            this.props.onClick(this.props.payload, this.props.value);
        }
    }

    render(){
        const classes = cx({
            'button-tabs__tab': true,
            'button-tabs__tab--selected': this.props.selected
        }, this.props.className);
        return (
            <button onClick={::this.handleClick} className={classes}>{this.props.value}</button>
        );
    }
}

export class ButtonTabs extends React.Component {

    static propTypes = {
        children: React.PropTypes.any,
        className: React.PropTypes.string
    }

    render() {
        const classes = cx('button-tabs', this.props.className);

        return (
            <div className={classes}>
                {this.props.children}
            </div>
        );
    }
}
