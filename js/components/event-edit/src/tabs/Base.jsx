import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import {TextView} from 'components/modules/text-label';
import CheckBox from 'components/modules/new-checkbox';
import DropDown from 'components/modules/dropdown';
import InputCalendar from 'components/modules/input-calendar';
import SelectOneItem from 'components/modules/select-one-item';
import SelectTree from 'components/modules/select-tree';
import EventTypes from 'utils/eventedit/EventTypes';
import {isNumberOrEmpty} from 'utils/validation/Validation';
import cx from 'classnames';

import Config from 'config';

import '../style/event-edit-base.scss';

class Base extends React.Component {

	static defaultProps = {
		places: {nodes:[]}
	}

	handleChangeName(name){
		EventEditActions.base.changeName(name);
	}

	handleChangeType(e, payload){
		EventEditActions.base.changeType(payload);
	}

	handleChangeCode(e, payload){
		EventEditActions.base.changeCode(payload);
	}

	handleChangeStartDateTime(dateTime) {
		EventEditActions.base.changeStartDateTime(dateTime);
	}

	handleChangeFinishDateTime(dateTime) {
		EventEditActions.base.changeFinishDateTime(dateTime);
	}

	handleChangeEducationOrg(e, payload){
		EventEditActions.base.changeEducationOrg(payload);
	}

	handleChangeEducationMethod(educationMethod){
		EventEditActions.base.changeEducationMethod(educationMethod);
	}

	handleChangePlaceText(place){
		EventEditActions.base.changePlaceText(place);
	}

	handleChangePlace(place){
		EventEditActions.base.changePlace(place);
	}

	handleChangeMaxPersonNum(num){
		EventEditActions.base.changeMaxPersonNum(num);
	}

	handleChangeIsPublic(isPublic){
		EventEditActions.base.changeIsPublic(isPublic);
	}

	handleChangeIsTestRepeat(isTestRepeat){
		EventEditActions.base.changeIsTestRepeat(isTestRepeat);
	}

	handleChangeIsRecordPublished(isRecordPublished){
		EventEditActions.base.changeIsRecordPublished(isRecordPublished);
	}

	render(){
		const educationMethodClasses = cx({
			'event-edit-base__edication-method': true,
			'event-edit-base__edication-method--display': this.props.selectedType !== EventTypes.keys.one_time
		});
		const isRecordPublishedClasses = cx({
			'event-edit-base__is-record-published': true,
			'event-edit-base__is-record-published--display': this.props.selectedType === EventTypes.keys.webinar
		});
		const {name, types, selectedType, codes, selectedCode, startDateTime, finishDateTime, educationOrgs, selectedEducationOrgId, selectedEducationMethod, place, places, maxPersonNum, isPublic, isTestRepeat, isRecordPublished} = this.props;
		return (
			<div className="event-edit-base">
				<div className="event-edit-base__left-block">
					<TextView
						onBlur={this.handleChangeName} 
						value={name} 
						placeholder="Название *" 
						className="event-edit-base__name"/>
					<DropDown 
						description="Тип *"
						onChange={this.handleChangeType} 
						items={types} 
						selectedPayload={selectedType}
						isReset={true}/>
					<DropDown 
						description="Код *"
						onChange={this.handleChangeCode} 
						items={codes} 
						selectedPayload={selectedCode}
						isReset={true}/>
					<div className="event-edit-base__date-time">
						<div className="date">
							<div className="date__start">
								<InputCalendar
									placeholder="Дата, время начала *"
									className="date__calendar" 
									date={startDateTime} 
									onSave={this.handleChangeStartDateTime}/>
							</div>
							<div className="date__finish">
								<InputCalendar
									placeholder="Дата, время завершения *"
									className="date__calendar" 
									date={finishDateTime} 
									onSave={this.handleChangeFinishDateTime}/>
							</div>
						</div>
					</div>
					<DropDown
						description="Обучающая организация *"
						onChange={this.handleChangeEducationOrg} 
						items={educationOrgs} 
						selectedPayload={selectedEducationOrgId}
						isReset={true}/>
					<SelectOneItem
						className={educationMethodClasses}
						selectedItem={selectedEducationMethod} 
						placeholder="Учебная программа *" 
						modalTitle="Выберите учебную программу"
						query={Config.url.createPath({action_name: 'getEducationMethod'})}
						onSave={this.handleChangeEducationMethod}/>
					<TextView
						onBlur={this.handleChangePlaceText} 
						value={place} 
						placeholder="Место проведения"
						className="event-edit-base__place-text"/>
					<SelectTree 
						nodes={places.nodes}
						selectedNode={places.selectedNode} 
						placeholder="Расположение *"
						modalTitle="Выберите расположение"
						onSave={this.handleChangePlace}
						isExpand={true}/>
				</div>
				<div className="event-edit-base__right-block">
					<TextView
						onBlur={this.handleChangeMaxPersonNum} 
						value={maxPersonNum} 
						placeholder="Максимальное количество участников"
						isValid={isNumberOrEmpty}
						className="event-edit-base__max-person-num"/>
					<CheckBox 
						onChange={this.handleChangeIsPublic} 
						label="Публичное мероприятие"
						checked={isPublic}/>
					<br />
					<br />
					<CheckBox 
						onChange={this.handleChangeIsTestRepeat} 
						label="Повторно назначать тесты при отрицательном результате"
						checked={isTestRepeat}/>
					<br />
					<br />
					<CheckBox
						className={isRecordPublishedClasses}
						onChange={this.handleChangeIsRecordPublished} 
						label="Опубликовать запись вебинара на портале"
						checked={isRecordPublished}/>
				</div>
			</div>
		);
	}
};

export default Base;