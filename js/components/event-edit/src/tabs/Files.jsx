import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import ComposeLabel from 'components/modules/compose-label';
import cx from 'classnames';
import '../style/event-edit-files.scss';

class File extends React.Component {

	handleRemoveFile(){
		if (this.props.onRemove){
			this.props.onRemove(this.props.id);
		}
	}

	render(){
		return(
			<ComposeLabel 
				onIconClick={::this.handleRemoveFile} 
				label={this.props.name} 
				prevIconClassName="fa fa-file" 
				postIconClassName="fa fa-remove"
				className="event-edit-files__file"
				labelClassName="event-edit-files__file-label"/>
		);
	}
}

class Files extends React.Component{

	static defaultProps = {
		files: []
	}

	handleChange(e){
		var files = e.target.files;
		EventEditActions.files.uploadFiles(files);
		this.refs.fileInput.value = '';
	}

	handleRemoveFile(id){
		EventEditActions.files.removeFile(id);
	}

	render(){
		var isUploadingClasses = cx({
			'event-edit-files__uploading': true,
			'event-edit-files__uploading--display': this.props.isUploading
		});
		return (
			<div className="event-edit-files">
				<label className="event-edit-files__upload event-btn">
					<i className="fa fa-upload event-edit-files__upload-icon"></i>
					<span className="event-edit-files__upload-text">Загрузить</span>
					<input ref="fileInput" onChange={::this.handleChange} type="file" multiple style={{display: 'none'}}/>
				</label>
				<span className={isUploadingClasses}></span>
				<div className="event-edit-files__list">
					{this.props.files.map((f, index) => {
						return <File key={index} {...f} onRemove={::this.handleRemoveFile}/>
					})}
				</div>
			</div>
		);
	}
};

export default Files;