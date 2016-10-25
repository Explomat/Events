import React from 'react';
import EventEditActions from 'actions/EventEditActions';
import CheckBox from 'components/modules/new-checkbox';
import {DropDownIcon} from 'components/modules/dropdown-icon';
import Info from 'components/modules/info';
import SelectItems from 'components/modules/select-items';
import ToggleButton from 'components/modules/toggle-button';
import cx from 'classnames';
import {every, some, filter} from 'lodash';
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
					<i className="icon-file"></i>
				</div>
				<div className="table-list__body-cell table-list__body-cell--75">{name}</div>
				<div className="table-list__body-cell">{type}</div>
				<div className="table-list__body-cell" title="Разрешить/запретить скачивание">
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
		const {name, year, author, checked} = this.props;
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
					<i className="icon-file"></i>
				</div>
				<div className="table-list__body-cell table-list__body-cell--65">{name}</div>
				<div className="table-list__body-cell">{year}</div>
				<div className="table-list__body-cell">{author}</div>
			</div>
		);
	}
}

class Files extends React.Component {

	constructor(props){
		super(props);
		this.MAX_LIBRARY_MATERIAL_COUNT = 2;
		this.LIBRARY_MATERIAL_MIME_TYPE = 'application/pdf';
		this.LIBRARY_MATERIAL_SHOW_TYPE = 'pdf';
	} 

	static defaultProps = {
		files: []
	}

	state = {
		isShowFiles: false,
		isShowLibraryMaterials: false
	}

	_isCorrectLibraryMaterialsType(libraryMaterials, type){
		return every(libraryMaterials, (lm) => {
			return lm.type === type;
		});
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
		var selectedItems = this._prepareLibraryMaterialsForModal(this.props.libraryMaterials);
		return this.state.isShowLibraryMaterials ? 
			<SelectItems
				title="Выберите материалы"
				selectedItems={selectedItems}
				query={config.url.createPath({action_name: 'getLibraryMaterials'})}
				onClose={::this.handleCloseLibraryMaterialsModal} 
				onSave={::this.handleUpdateLibraryMaterials}
				maxSelectedItems={this.MAX_LIBRARY_MATERIAL_COUNT}/> : null;
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
		EventEditActions.files.uploadFiles(this.props.files, files);
		this.refs.fileInput.value = '';
	}

	handleChangeLibraryMaterials(e){
		var libraryMaterialRef = this.refs.libraryMaterial;
		var files = e.target.files;
		if (!this._isCorrectLibraryMaterialsType(files, this.LIBRARY_MATERIAL_MIME_TYPE)) {
			e.preventDefault();
			libraryMaterialRef.value = '';
			EventEditActions.files.changeInfoMessageLibraryMaterials(`Вы не можете загрузить материалы с типом отличным от '${this.LIBRARY_MATERIAL_SHOW_TYPE}' !`, 'error');
			return;
		}

		EventEditActions.files.uploadLibraryMaterials(this.props.libraryMaterials, files);
		libraryMaterialRef.value = '';
	}

	handleRemoveFiles(){
		var filesIds = filter(this.props.files, (f) => {
			return f.checked === true;
		}).map((f) => {
			return f.id;
		});
		EventEditActions.files.removeFiles(filesIds);
	}

	handleRemoveLibraryMaterials(){
		var materials = this.props.libraryMaterials.filter((lm) => {
			return lm.checked === false;
		});
		EventEditActions.files.updateLibraryMaterials(materials);
	}

	handleInputFilesClick(e){
		if (this.props.libraryMaterials.length >= this.MAX_LIBRARY_MATERIAL_COUNT) {
			e.preventDefault();
			EventEditActions.files.changeInfoMessageLibraryMaterials(`Вы не можете загрузить более ${this.MAX_LIBRARY_MATERIAL_COUNT} материалов !`, 'error');
		}
	}

	handleRemoveInfoMessage(){
		EventEditActions.files.changeInfoMessageLibraryMaterials('');
	}

	render(){
		const isDisplayFilesButtons = this._isSomeChecked(this.props.files) && this.props.files.length > 0;
		const isDisplayLibraryMaterialsButtons = this._isSomeChecked(this.props.libraryMaterials) && this.props.libraryMaterials.length > 0;

		const tableDescrFilesClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.files.length === 0 && !this.props.isUploadingFiles
		});
		const tableDescrLibraryMaterialsClasses = cx({
			'table-list__description-is-empty': true,
			'table-list__description-is-empty--display': this.props.libraryMaterials.length === 0 && !this.props.isUploadingLibraryMaterials
		});

		const removeFilesClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isDisplayFilesButtons,
			'default-button': true
		});
		const checkboxFilesClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.files.length > 0,
			'default-button': true
		});

		const removeLibraryMaterialsClasses = cx({
			'buttons__remove': true,
			'buttons__remove--display': isDisplayLibraryMaterialsButtons,
			'default-button': true
		});
		const checkboxLibraryMaterialsClasses = cx({
			'buttons__checkbox': true,
			'buttons__checkbox--display': this.props.libraryMaterials.length > 0,
			'default-button': true
		});

		const isUploadingFilesClasses = cx({
			'overlay-loading': true,
			'overlay-loading--show': this.props.isUploadingFiles
		});
		const isUploadingLibraryMaterialsClasses = cx({
			'overlay-loading': true,
			'overlay-loading--show': this.props.isUploadingLibraryMaterials
		});

		const isShowInfoModal = this.props.infoMessageDownloadLibraryMaterials !== '';
		return (
			<div className="event-edit-files">
				<div className="files">
					<div className="buttons">
						<DropDownIcon 
							className={checkboxFilesClasses}
							icon={<CheckBox 
									onChange={::this.handleToggleCheckedAllFiles} 
									checked={this.props.checkedAllFiles} 
									className={checkboxFilesClasses}/>}
						/>
						<div className="buttons__funcs">
							<label className="buttons__upload default-button">
								<i className="icon icon-upload"></i>
								<input ref="fileInput" onChange={::this.handleChangeFiles} type="file" multiple style={{display: 'none'}}/>
							</label>
							<button onClick={::this.handleOpenFilesModal} className="buttons__add default-button" title="Добавить файлы">
								<i className="icon icon-page-add buttons__icon"></i>
							</button>
							<button onClick={::this.handleRemoveFiles} className={removeFilesClasses} title="Удалить файлы">
								<i className="icon icon-page-delete buttons__icon"></i>
							</button>
						</div>
					</div>
					<strong className="files__description">Файлы</strong>
					<div className="table-list file-list">
						<span className={tableDescrFilesClasses}>Нет файлов</span>
						<span className={isUploadingFilesClasses}></span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.files.map((item, index) => {
									return <File key={index} {...item}/>
								})}
							</div>
						</div>
					</div>		
				</div>
				<div className="library-materials">
					<div className="buttons">
						<DropDownIcon 
							className={checkboxLibraryMaterialsClasses}
							icon={<CheckBox 
									onChange={::this.handleToggleCheckedAllLibraryMaterials} 
									checked={this.props.checkedAllLibraryMaterials} 
									className={checkboxLibraryMaterialsClasses}/>}
						/>
						<div className="buttons__funcs">
							<label className="buttons__upload default-button">
								<i className="icon icon-upload"></i>
								<input ref="libraryMaterial" onClick={::this.handleInputFilesClick} onChange={::this.handleChangeLibraryMaterials} type="file" multiple style={{display: 'none'}} accept=".pdf"/>
							</label>
							<button onClick={::this.handleOpenLibraryMaterialsModal} className="buttons__add default-button" title="Добавить файлы">
								<i className="icon icon-page-add buttons__icon"></i>
							</button>
							<button onClick={::this.handleRemoveLibraryMaterials} className={removeLibraryMaterialsClasses} title="Удалить файлы">
								<i className="icon icon-page-delete buttons__icon"></i>
							</button>
						</div>
					</div>
					<strong className="library-materials__description">Материалы библиотеки</strong>
					<div className="table-list library-material-list">
						<span className={tableDescrLibraryMaterialsClasses}>Нет материалов</span>
						<span className={isUploadingLibraryMaterialsClasses}></span>
						<div className="table-list__table">
							<div className="table-list__header">
								{this.props.libraryMaterials.map((item, index) => {
									return <LibraryMaterial key={index} {...item}/>
								})}
							</div>
						</div>
						
					</div>
				</div>
				{this._getFilesModal()}
				<Info
					status={this.props.infoStatusDownloadLibraryMaterials}
					message={this.props.infoMessageDownloadLibraryMaterials}
					isShow={isShowInfoModal}
					onClose={this.handleRemoveInfoMessage}/>
				{this._getLibraryMaterialsModal()}
			</div>
		);
	}
};

export default Files;