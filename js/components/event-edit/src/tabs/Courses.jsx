import React from 'react';
import EventEditActions from 'actions/EventEditActions';

import '../style/event-edit-courses.scss';

class CourseItem extends React.Component {

	render(){
		const {fullname, assessmentName, score} = this.props;
		return (
			<div className="table-list__body-row">
				<div className="table-list__body-cell">{fullname}</div>
				<div className="table-list__body-cell">{assessmentName}</div>
				<div className="table-list__body-cell">{score}</div>
			</div>
		);
	}
}

class Courses extends React.Component {

	handleSort(e){
		let target = e.currentTarget;
		let caret = target.querySelector('.caret');
		let isAsc = caret.classList.contains('caret--rotate');
		let targetData = target.getAttribute('data-sort');
		EventEditActions.courses.sortTable(targetData, isAsc);
		caret.classList.toggle('caret--rotate');
	}

	render(){
		return (
			<div className="event-edit-courses">
				<div className="table-list courses-list">
					<div className="table-list__header table-list__header--header">
						<div className="table-list__header-row">
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w40" data-sort="fullname">
								<span className="table-list__header-cell-name">ФИО</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w40" data-sort="assessmentName">
								<span className="table-list__header-cell-name">Курс</span>
								<span className="caret table-list__caret"></span>
							</div>
							<div onClick={this.handleSort} className="table-list__header-cell table-list__header-cell--w20" data-sort="score">
								<span className="table-list__header-cell-name">Результат</span>
								<span className="caret table-list__caret"></span>
							</div>
						</div>
					</div>
					<div className="table-list__table">
						<div className="table-list__header">
							<div className="table-list__header-row">
								<div className="table-list__header-cell table-list__header-cell--w40"></div>
								<div className="table-list__header-cell table-list__header-cell--w40"></div>
								<div className="table-list__header-cell table-list__header-cell--w20"></div>
							</div>
							{this.props.courses.map((item, index) => {
								return <CourseItem key={index} {...item}/>
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Courses;