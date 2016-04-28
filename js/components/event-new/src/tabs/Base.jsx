import React from 'react';
import {TextView} from 'components/modules/text-label';
import DropDown from 'components/modules/dropdown';
import EventNewActions from 'actions/EventNewActions';

class Base extends React.Component {

	handleChangeName(val){
		EventNewActions.base.changeName(val);
	}

	handleChangeType(e, payload){
		EventNewActions.base.changeType(payload);
	}

	handleChangeCode(e, payload){
		EventNewActions.base.changeCode(payload);
	}

	handleChangeEducationOrg(e, payload){
		EventNewActions.base.changeEducationOrg(payload);
	}

	render(){
		return (
			<div className="event-new-base">
				<TextView
					onBlur={this.handleChangeName} 
					value={this.props.name} 
					placeholder="Название *" 
					className="event-new-base__name"/>
				<DropDown 
					description="Тип *"
					onChange={this.handleChangeType} 
					items={this.props.types} 
					selectedPayload={this.props.selectedType}
					isReset={true}/>
				<DropDown 
					description="Код *"
					onChange={this.handleChangeCode} 
					items={this.props.codes} 
					selectedPayload={this.props.selectedCode}
					isReset={true}/>
				<DropDown
					description="Обучающая организация *"
					onChange={this.handleChangeEducationOrg} 
					items={this.props.educationOrgs} 
					selectedPayload={this.props.selectedEducationOrgId}
					isReset={true}/>
			</div>
		);
	}
};

export default Base;