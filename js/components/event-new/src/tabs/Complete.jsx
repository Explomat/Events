import React from 'react';
import Info from 'components/modules/info';
import cx from 'classnames';
import EventNewActions from 'actions/EventNewActions';
import EventNewStore from 'stores/EventNewStore';
import Hasher from 'utils/Hasher';

class Complete extends React.Component {

	constructor(props){
		super(props);
		this.isComplete = false;
		this.isSave = false;
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.id === null) {
			return;
		}
		if (this.isComplete) {
			Hasher.setHash('#calendar');
		}
		else if(this.isSave){
			Hasher.setHash('#event/edit/' + nextProps.id);
		}
	}

	handleCompleteEvent(){
		EventNewActions.complete.saveEvent(EventNewStore.getData());
		this.isComplete = true;
	}

	handleSaveEvent(){
		EventNewActions.complete.saveEvent(EventNewStore.getData());
		this.isSave = true;
	}

	handleRemoveError(){
		EventNewActions.complete.removeError();
	}

	render(){
		const {error, isLoading} = this.props;
		const isLoadingClass = cx({
			'overlay-loading': true,
			'overlay-loading--show': isLoading
		});
		const isShowInfoModal = error !== null;
		return (
			<div className="event-new-complete">
				<div className="event-new-complete__buttons">
					<i className="icon-help event-new-complete__icon-question"></i>
					<button 
						onClick={::this.handleCompleteEvent} 
						className="event-btn event-btn--reverse event-new-complete__complete-button">Завершить создание</button>
					<button
						onClick={::this.handleSaveEvent}  
						className="event-btn event-btn--reverse event-new-complete__save-button">Сохранить и продолжить</button>
				</div>
				<div className={isLoadingClass}></div>
				<Info
					status='error'
					message={error}
					isShow={isShowInfoModal}
					onClose={this.handleRemoveError}/>
			</div>	
		);
	}
};

export default Complete;