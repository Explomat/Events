import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import '../style/event-edit-files.scss';

class File extends React.Component {
	render(){
		return(
			<div>{this.props.name}</div>
		);
	}
}

class Files extends React.Component{

	static defaultProps = {
		files: []
	}

	handleChange(e){
		var files = e.target.files;
		for (var i = files.length - 1; i >= 0; i--) {
			let file = files[i];
			let reader = new FileReader();
			reader.onload = (e) => {
				EventEditActions.files.uploadFile(file.name, e.target.result);
				//console.log(e.target.result);
			}
			reader.readAsBinaryString(file);
		};
	}

	render(){
		return (
			<div className="event-edit-files">
				<input onChange={this.handleChange} type="file" name="files[]" multiple />
				<output id="event-edit-files__list">
					{this.props.files.map(f => {
						return <File {...f} />
					})}
				</output> 
			</div>
		);
	}
};

export default Files;