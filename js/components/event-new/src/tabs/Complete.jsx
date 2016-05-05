import React from 'react';
import Info from 'components/modules/info';
import EventNewActions from 'actions/EventNewActions';
import EventNewStore from 'stores/EventNewStore';
import Hasher from 'utils/Hasher';

class Complete extends React.Component {

	state = {
		error: null
	}

	_showLoading(){
		var node = this.refs.isLoading;
		node.classList.add('overlay-loading--show');
	}

	_hideLoading(){
		var node = this.refs.isLoading;
		node.classList.remove('overlay-loading--show');
	}

	handleCompleteEvent(){
		this._showLoading();
		EventNewActions.complete.saveEvent(EventNewStore.getData()).then((data) => {
			this._hideLoading();
			const error = data.error;
			if (error) {
				this.setState({error: error});
			}
			else {
				Hasher.setHash('#calendar');
			}
		});
	}

	handleSaveEvent(){
		this._showLoading();
		EventNewActions.complete.saveEvent(EventNewStore.getData()).then((data) => {
			this._hideLoading();
			const {id, error} = data;
			if (error && !id) {
				this.setState({error: error});
			}
			else {
				Hasher.setHash('#event/edit/' + id);
			}
		});
	}

	handleRemoveError(){
		this.setState({error: null});
	}

	render(){
		const isShowInfoModal = this.state.error !== null;
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
				<div ref="isLoading" className="overlay-loading"></div>
				<Info
					status='error'
					message={this.state.error}
					isShow={isShowInfoModal}
					onClose={::this.handleRemoveError}/>
			</div>	
		);
	}
};

export default Complete;