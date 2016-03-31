import React from 'react';
import EventEditActions from 'actions/EventEditActions';
//import cx from 'classnames';

import '../style/event-edit-collaborators.scss';

class CollaboratorItem extends React.Component {

	handleToggleIsAssist(){
		EventEditActions.toggleIsAssist(this.props.id, !this.props.isAssist);
	}

	render(){
		let {fullname, subdivision, position, isAssist} = this.props;
		return (
			<div className="collaborator-list__body-row">
				<div className="collaborator-list__body-cell">{fullname}</div>
				<div className="collaborator-list__body-cell">{position}</div>
				<div className="collaborator-list__body-cell">{subdivision}</div>
				<div className="collaborator-list__body-cell">
					<div className="toggle-btn">
						<input onChange={::this.handleToggleIsAssist} type="checkbox" className="toggle__input"  id={this.props.id} checked={isAssist}/>
						<label className="toggle__checkbox" htmlFor={this.props.id}></label>
					</div>
				</div>
			</div>
		);
	}
}

class Collaborators extends React.Component {

	handleSort(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.sortCollaboratorsTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
	}

	render(){
		return (
			<div className="event-edit-collaborators">
				<div className="collaborator-list">
					<div className="collaborator-list__header collaborator-list__header--header">
						<div className="collaborator-list__header-row">
							<div onClick={this.handleSort} className="collaborator-list__header-cell collaborator-list__header-cell--w30" data-sort="fullname">
								<span className="collaborator-list__header-cell-name">ФИО</span>
								<span className="caret collaborator-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="collaborator-list__header-cell collaborator-list__header-cell--w25" data-sort="position">
								<span className="collaborator-list__header-cell-name">Должность</span>
								<span className="caret collaborator-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="collaborator-list__header-cell collaborator-list__header-cell--w25" data-sort="subdivision">
								<span className="collaborator-list__header-cell-name">Подразделение</span>
								<span className="caret collaborator-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="collaborator-list__header-cell collaborator-list__header-cell--w1" data-sort="isAssist">
								<span className="collaborator-list__header-cell-name">Статус</span>
								<span className="caret collaborator-list__caret"></span>
							</div>
						</div>
					</div>
					<div className="collaborator-list__table collaborator-list__table--collaborators">
						<div className="collaborator-list__header">
							<div className="collaborator-list__header-row">
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w30">ФИО</div>
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w25">Должность</div>
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w25">Подразделение</div>
								<div className="collaborator-list__header-cell collaborator-list__header-cell--w1">Статус</div>
							</div>
							{this.props.collaborators.map((item, index) => {
								return <CollaboratorItem key={index} {...item} />
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Collaborators;