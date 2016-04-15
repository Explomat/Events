import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import CheckBox from 'components/modules/new-checkbox';
import DropDownIcon from 'components/modules/dropdown-icon';
import SelectItems from 'components/modules/select-items';
import ToggleButton from 'components/modules/toggle-button';
import cx from 'classnames';
import {some, filter} from 'lodash';
import config from 'config';
import '../style/event-edit-files.scss';

class File extends React.Component {

	handleToggleChecked(){
		EventEditActions.files.toggleFileChecked(this.props.id, !this.props.checked);
	}

	handleToggleIsAllowDownload(){
		EventEditActions.files.toggleFileIsAllowDownload(this.props.id, !this.props.isAllowDownload);
	}

	render(){
		const {id, name, type, isAllowDownload, checked} = this.props;
		const classes = cx({
			'table-list__body-row': true,
			'table-list__body-row--selected': checked
		});
		return (
			<div className={classes}>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<i className="fa fa-file"></i>
				</div>
				<div className="table-list__body-cell">{name}</div>
				<div className="table-list__body-cell">{type}</div>
				<div className="table-list__body-cell">
					<ToggleButton id={id} onChange={::this.handleToggleIsAllowDownload} checked={isAllowDownload} />
				</div>
			</div>
		);
	}
}

class LibraryMaterial extends React.Component {

	handleToggleChecked(){
		EventEditActions.files.toggleLibraryMaterialChecked(this.props.id, !this.props.checked);
	}

	render(){
		const {name, checked} = this.props;
		const classes = cx({
			'table-list__body-row': true,
			'table-list__body-row--selected': checked
		})
		return (
			<div className={classes}>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<CheckBox onChange={::this.handleToggleChecked} checked={checked}/>
				</div>
				<div className="table-list__body-cell table-list__body-cell--icon">
					<i className="fa fa-file"></i>
				</div>
				<div className="table-list__body-cell">{name}</div>
			</div>
		);
	}
}

class Files extends React.Component{

	static defaultProps = {
		files: []
	}

	state = {
		isShowFiles: false,
		isShowLibraryMaterials: false
	}

	_isSomeChecked(items){
		return some(items, {checked: true});
	}

	_prepareFilesForModal(files){
		return files.map((f) => {
			return {
				id: f.id,
				data: {
					name: f.name,
					type: f.type
				},
				additionalData: {
					isAllowDownload: f.isAllowDownload
				}	
			}
		})
	}

	_prepareLibraryMaterialsForModal(libraryMaterials){
		return libraryMaterials.map((l) => {
			return {
				id: l.id,
				data: {
					name: l.name,
					year: l.year,
					author: l.author
				}	
			}
		})
	}

	_getFilesModal(){
		var selectedItems = this._prepareFilesForModal(this.props.files);
		return this.state.isShowFiles ? 
			<SelectItems
				title="Выберите файлы"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getFiles'})}
				onClose={::this.handleCloseFilesModal} 
				onSave={::this.handleUpdateFiles}/> : null;
	}

	_getLibraryMaterialsModal(){
		var selectedItems = this._prepareFilesForModal(this.props.libraryMaterials);
		return this.state.isShowLibraryMaterials ? 
			<SelectItems
				title="Выберите материалы"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getLibraryMaterials'})}
				onClose={::this.handleCloseLibraryMaterialsModal} 
				onSave={::this.handleUpdateLibraryMaterials}/> : null;
	}

	handleToggleCheckedAllFiles(){
		EventEditActions.files.toggleCheckedAllFiles(!this.props.checkedAllFiles);
	}

	handleToggleCheckedAllLibraryMaterials(){
		EventEditActions.files.toggleCheckedAllLibraryMaterials(!this.props.checkedAllLibraryMaterials);
	}

	handleOpenFilesModal(){
		this.setState({isShowFiles: true});
	}

	handleOpenLibraryMaterialsModal(){
		this.setState({isShowLibraryMaterials: true});
	}

	handleCloseFilesModal(){
		this.setState({isShowFiles: false});
	}

	handleUpdateFiles(files){
		this.setState({isShowFiles: false});
		EventEditActions.files.updateFiles(files);
	}

	handleCloseLibraryMaterialsModal(){
		this.setState({isShowLibraryMaterials: false});
	}

	handleUpdateLibraryMaterials(libraryMaterials){
		this.setState({isShowLibraryMaterials: false});
		EventEditActions.files.updateLibraryMaterials(libraryMaterials);
	}

	handleChangeFiles(e){
		var files = e.target.files;
		EventEditActions.files.uploadFiles(files);
		this.refs.fileInput.value = '';
	}

	handleChangeLibraryMaterials(e){
		var files = e.target.files;
		EventEditActions.files.uploadLibraryMaterials(files);
		this.refs.libraryMaterial.value = '';
	}

	handleRemoveFiles(){
		var filesIds = filter(this.props.files, (f) => {
			return f.checked === true;
		}).map((f) => {
			return f.id;
		});
		EventEditActions.files.removeFiles(filesIds);
	}

	handleRemoveLibraryMaterial(id){
		EventEditActions.files.removeLibraryMaterial(id);
	}

	render(){
		const isDisplayFilesButtons = this._isSomeChecked(this.props.files) && this.props.files.length > 0;
		const isDisplayLibraryMaterialsButtons = this._isSomeChecked(this.props.libraryMaterials) && this.props.libraryMaterials.length > 0;

		const tableDescrFilesClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.files.length === 0
		});
		const tableDescrLibraryMaterialsClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.libraryMaterials.length === 0
		});

		const removeFilesClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isDisplayFilesButtons,
			'default-button': true
		});
		const checkboxFilesClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.files.length > 0
		});

		const removeLibraryMaterialsClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isDisplayLibraryMaterialsButtons,
			'default-button': true
		});
		const checkboxLibraryMaterialsClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.libraryMaterials.length > 0
		});


		const isUploadingFilesClasses = cx({
			'event-edit-files__uploading': true,
			'event-edit-files__uploading--display': this.props.isUploadingFiles
		});
		const isUploadingLibraryMaterialsClasses = cx({
			'event-edit-files__uploading': true,
			'event-edit-files__uploading--display': this.props.isUploadingLibraryMaterials
		});
		return (
			<div className="event-edit-files">
				<div className="files">
					<div className="buttons">
						<DropDownIcon className={checkboxFilesClasses}>
							<CheckBox onChange={::this.handleToggleCheckedAllFiles} checked={this.props.checkedAllFiles} className={checkboxFilesClasses}/>
						</DropDownIcon>
						<label className="event-edit-files__upload default-button">
							<i className="fa fa-upload event-edit-files__upload-icon"></i>
							<input ref="fileInput" onChange={::this.handleChangeFiles} type="file" multiple style={{display: 'none'}}/>
						</label>
						<span className={isUploadingFilesClasses}></span>

						<div className="buttons__funcs">
							<button onClick={::this.handleOpenFilesModal} className="buttons__add default-button" title="Добавить файлы">
								<i className="fa fa-plus"></i>
							</button>
							<button onClick={::this.handleRemoveFiles} className={removeFilesClasses} title="Удалить файлы">
								<i className="fa fa-minus"></i>
							</button>
						</div>
					</div>
					<strong className="files__description">Файлы</strong>
					<div className="table-list file-list">
						<span className={tableDescrFilesClasses}>Нет файлов</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.files.map((item, index) => {
									return <File key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getFilesModal()}
					</div>		
				</div>
				<div className="library-materials">
					<div className="buttons">
						<DropDownIcon className={checkboxLibraryMaterialsClasses}>
							<CheckBox onChange={::this.handleToggleCheckedAllLibraryMaterials} checked={this.props.checkedAllLibraryMaterials} className={checkboxLibraryMaterialsClasses}/>
						</DropDownIcon>
						<label className="event-edit-files__upload default-button">
							<i className="fa fa-upload event-edit-files__upload-icon"></i>
							<input ref="libraryMaterial" onChange={::this.handleChangeLibraryMaterials} type="file" multiple style={{display: 'none'}}/>
						</label>
						<span className={isUploadingLibraryMaterialsClasses}></span>
						<div className="buttons__funcs">
							<button onClick={::this.handleOpenLibraryMaterialsModal} className="buttons__add default-button" title="Добавить файлы">
								<i className="fa fa-plus"></i>
							</button>
							<button onClick={this.handleRemoveLibraryMaterials} className={removeLibraryMaterialsClasses} title="Удалить файлы">
								<i className="fa fa-minus"></i>
							</button>
						</div>
					</div>
					<strong className="library-materials__description">Материалы библиотеки</strong>
					<div className="table-list library-material-list">
						<span className={tableDescrLibraryMaterialsClasses}>Нет материалов</span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.libraryMaterials.map((item, index) => {
									return <LibraryMaterial key={index} {...item}/>
								})}
							</div>
						</div>
						{this._getLibraryMaterialsModal()}
					</div>	
				</div>
			</div>
		);
	}
};

export default Files;