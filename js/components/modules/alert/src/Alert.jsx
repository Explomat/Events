import React, {Component} from 'react';
import cx from 'classnames';

import './style/alert.scss';

class Alert extends Component {

    handleClose(){
        if (this.props.onClose){
            this.props.onClose();
        }
    }

    render() {

        const {text, className} = this.props;
        const classes = cx("alert", className);
        return (
            <div className={classes}>
                <button type="button" className="close-button" onClick={::this.handleClose}>&times;</button>
                {text}
            </div>
        );
    }
};

class AlertSuccess extends Component {

    render() {
        const {className} = this.props;
        const classes = cx("alert--success", className);
        return <Alert {...this.props} className={classes}/>
    }
};

class AlertInfo extends Component {

    render() {
        const {className} = this.props;
        const classes = cx("alert--info", className);
        return <Alert {...this.props} className={classes}/>
    }
};

class AlertWarning extends Component {

    render() {
        const {className} = this.props;
        const classes = cx("alert--warning", className);
        return <Alert {...this.props} className={classes}/>
    }
};

class AlertDanger extends Component {

    render() {
        const {className} = this.props;
        const classes = cx("alert--danger", className);
        return <Alert {...this.props} className={classes}/>
    }
};

Alert.propTypes = {
    text: React.PropTypes.string.isRequired,
    onClose: React.PropTypes.func,
    className: React.PropTypes.string
}
export {Alert, AlertSuccess, AlertInfo, AlertWarning, AlertDanger}