import React from 'react';
import {TextView} from 'components/modules/text-label';

import './style/new-lector.scss';

class NewLector extends React.Component {

    constructor(props){
        super(props);

        this.fields = {
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
            company: ''
        }
    }

    static propTypes = {
        onSave: React.PropTypes.func,
        onClose: React.PropTypes.func
    }

    static defaultProps = {
        isShow: false
    }

    state = {
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        company: ''
    }

    handleChangeFirstName(firstName){
        this.fields.firstName = firstName;
        //this.setState({firstName: firstName});
    }

    handleChangeLastName(lastName){
        this.fields.lastName = lastName;
        //this.setState({lastName: lastName});
    }

    handleChangeMiddleName(middleName){
        this.fields.middleName = middleName;
        //this.setState({middleName: middleName});
    }

    handleChangeEmail(email){
        this.fields.email = email;
        //this.setState({email: email});
    }

    handleChangeCompany(company){
        this.fields.company = company;
        //this.setState({company: company});
    }

    handleSave(){
        if (this.props.onSave){
            this.props.onSave({...this.fields});
        }
    }

    render() {
        if (!this.props.isShow) {
            return null;
        }

        return (
            <div className="new-lector">
                <div className="new-lector__modal-box">
                    <div className="new-lector__content">
                        <div className="new-lector__header">
                            <button type="button" className="close-btn" onClick={this.props.onClose}>&times;</button>
                            <span>Добавить преподавателя</span>
                        </div>
                        <div className="new-lector__body clearfix">
                            <TextView
                                onBlur={this.handleChangeFirstName} 
                                value={this.state.firstName} 
                                placeholder="Имя *" 
                                className="new-lector__first-name"/>
                            <TextView
                                onBlur={this.handleChangeLastName} 
                                value={this.state.lastName} 
                                placeholder="Фамилия *" 
                                className="new-lector__last-name"/>
                            <TextView
                                onBlur={this.handleChangeMiddleName} 
                                value={this.state.middleName} 
                                placeholder="Отчество *" 
                                className="new-lector__middle-name"/>
                            <TextView
                                onBlur={this.handleChangeEmail} 
                                value={this.state.email} 
                                placeholder="Электронная почта *" 
                                className="new-lector__email"/>
                            <TextView
                                onBlur={this.handleChangeCompany} 
                                value={this.state.company} 
                                placeholder="Компания *" 
                                className="new-lector__company"/>
                            
                        </div>
                        <div className="new-lector__footer">
                            <button onClick={this.handleSave} className="new-lector__save-button event-btn event-btn--reverse">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default NewLector;
