var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEditConstants = require('../constants/EventEditConstants');
var EventEditAPI = require('../api/EventEditAPI');
var filter = require('lodash/filter');

var EventEditActions = {
	
	receiveData(data) {
		AppDispatcher.handleAction({
			actionType: EventEditConstants.RECEIVE_EVENTEDIT_DATA,
			data: data
		});
	},

	saveData(data){
		EventEditAPI.saveData(data).then(function(data) {
			if (data.error === '') {
				AppDispatcher.handleAction({
					actionType: EventEditConstants.CHANGE_INFO_MESSAGE,
					message: 'Мероприятие сохранено!',
					status: 'done'
				});
			}
			else {
				AppDispatcher.handleAction({
					actionType: EventEditConstants.CHANGE_INFO_MESSAGE,
					message: 'При сохранении произошла ошибка: \'' + data.error + '\'',
					status: 'error'
				});
			}
		});
	},

	changeInfoMessage(message, status){
		AppDispatcher.handleAction({
			actionType: EventEditConstants.CHANGE_INFO_MESSAGE,
			message: message,
			status: status
		});
	},

	changeStatus(status){
		EventEditAPI.changeStatus(status).then(function(data){
			if (data.error === '') {
				AppDispatcher.handleAction({
					actionType: EventEditConstants.CHANGE_STATUS,
					status: status
				});
			}
			else {
				AppDispatcher.handleAction({
					actionType: EventEditConstants.CHANGE_INFO_MESSAGE,
					message: data.error,
					status: 'error'
				});
			}
		});
	},

	//BASE
	base: {
		changeName(name){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_NAME,
				name: name
			});
		},
		changeType(type){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_TYPE,
				type: type
			});
		},
		changeCode(code){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_CODE,
				code: code
			});
		},
		changeStartDateTime(dateTime){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_START_DATETIME,
				dateTime: dateTime
			});
		},
		changeFinishDateTime(dateTime){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_FINISH_DATETIME,
				dateTime: dateTime
			});
		},
		changeEducationOrg(educationOrgId){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_EDUCATION_ORG,
				educationOrgId: educationOrgId
			});
		},
		changeEducationMethod(educationMethod){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_EDUCATION_METHOD,
				educationMethod: educationMethod
			});
		},
		changePlace(place){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_PLACE,
				place: place
			});
		},
		changeMaxPersonNum(num){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_BASE_CHANGE_MAX_PERSON_NUM,
				num: num
			});
		}
	},

	requests: {
		changeIsOpen(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_OPEN,
				checked: checked
			});
		},
		changeRequestBeginDate(date){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_REQUEST_BEGIN_DATE,
				date: date
			});
		},
		changeRequestOverDate(date){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_REQUEST_OVER_DATE,
				date: date
			});
		},
		changeIsApproveByBoss(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_BOSS,
				checked: checked
			});
		},
		changeIsApproveByTutor(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_IS_APPROVE_BY_TUTOR,
				checked: checked
			});
		},
		sortRequestTable(payload){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_REQUESTS_SORT_TABLE,
				payload: payload
			});
		},
		changeRequestStatus(id, status, reason){
			EventEditAPI.changeRequestStatus(id, status, reason).then(function(data){
				if (data === '') {
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_REQUESTS_CHANGE_STATUS,
						id: id,
						status: status
					});
				}
			});
		}
	},

	collaborators: {
		toggleIsAssist(id, isAssist){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_IS_ASSIST,
				id: id,
				isAssist: isAssist
			});
		},
		sortCollaboratorsTable(payload){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_SORT_TABLE,
				payload: payload
			});
		},
		toggleCheckedAll(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_ALL,
				checked: checked
			});
		},
		toggleChecked(id, checked) {
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED,
				id: id,
				checked: checked
			});
		},
		toggleCheckedConditions(payload) {
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_TOGGLE_CHECKED_CONDITIONS,
				payload: payload
			});
		},
		removeItems(){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_REMOVE_ITEMS
			});
		},
		notificateItems(items, subject, body){
			EventEditAPI.notificateItems(items, subject, body).then(function(data){
				let message = data.message;
				let error = data.error;
				let infoStatus = error ? 'error': 'done';
				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_CHANGE_INFO_MESSAGE,
					infoMesage: message,
					infoStatus: infoStatus
				});
			}, function(/*err*/){

			});
			
		},
		changeInfoMessage(message){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_CHANGE_INFO_MESSAGE,
				infoMesage: message
			});
		},
		updateItems(items){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COLLABORATORS_UPDATE_ITEMS,
				items: items
			});
		}
	},

	tutors: {
		toggleTutorIsMain(id, main){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_TUTOR_IS_MAIN,
				id: id,
				main: main
			});
		},
		toggleTutorChecked(id, checked) {
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_TUTOR_CHECKED,
				id: id,
				checked: checked
			});
		},
		toggleLectorChecked(id, checked) {
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_LECTOR_CHECKED,
				id: id,
				checked: checked
			});
		},
		sortTutorsTable(payload){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_SORT_TUTORS_TABLE,
				payload: payload
			});
		},
		sortLectorsTable(payload){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_SORT_LECTORS_TABLE,
				payload: payload
			});
		},
		toggleCheckedTutorsConditions(payload){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_CHECKED_TUTORS_CONDITIONS,
				payload: payload
			});
		},
		toggleCheckedAllTutors(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_TUTORS,
				checked: checked
			});
		},
		toggleCheckedAllLectors(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_TOGGLE_CHECKED_ALL_LECTORS,
				checked: checked
			});
		},
		removeTutors(){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_REMOVE_TUTORS
			});
		},
		removeLectors(){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_REMOVE_LECTORS
			});
		},
		updateTutors(tutors){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_UPDATE_TUTORS,
				tutors: tutors
			});
		},
		updateLectors(lectors){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_UPDATE_LECTORS,
				lectors: lectors
			});
		},
		updateInnerLectors(lectors){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_UPDATE_INNER_LECTORS,
				lectors: lectors
			});
		},
		createLector(lector){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_CREATE_LECTOR,
				lector: lector
			});
		},
		selectLectorType(payload){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TUTORS_SELECT_LECTOR_TYPE,
				payload: payload
			});
		}
	},

	testing: {

		selectTestTypes(payload){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TESTING_SELECT_TEST_TYPES,
				payload: payload
			});
		},

		updateTests(tests, type){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TESTING_UPDATE_TESTS,
				tests: tests,
				type: type
			});
		},

		toggleChecked(id, checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TESTING_TOGGLE_CHECKED,
				id: id,
				checked: checked
			});
		},

		toggleCheckedAll(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TESTING_TOGGLE_CHECKED_ALL,
				checked: checked
			});
		},

		removeTests(){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TESTING_REMOVE_TESTS
			});
		},

		sortAllTests(key, isAsc){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TESTING_SORT_ALL_TESTS,
				key: key,
				isAsc: isAsc
			});
		},

		sortTestingList(key, isAsc){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_TESTING_SORT_TESTING_LIST,
				key: key,
				isAsc: isAsc
			});
		}
	},

	courses: {
		sortTable(key, isAsc){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_COURSES_SORT_TABLE,
				key: key,
				isAsc: isAsc
			});
		}
	},

	files: {
		toggleFileIsAllowDownload(id, isAllowDownload){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_FILES_TOGGLE_FILE_IS_ALLOW_DOWNLOAD,
				id: id,
				isAllowDownload: isAllowDownload
			});
		},
		toggleCheckedAllFiles(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_FILES_TOGGLE_CHECKED_ALL_FILES,
				checked: checked
			});
		},

		toggleCheckedAllLibraryMaterials(checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_FILES_TOGGLE_CHECKED_ALL_LIBRARY_MATERIALS,
				checked: checked
			});
		},

		toggleFileChecked(id, checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_FILES_TOGGLE_CHECKED_FILE,
				id: id,
				checked: checked
			});
		},

		toggleLibraryMaterialChecked(id, checked){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_FILES_TOGGLE_CHECKED_LIBRARY_MATERIAL,
				id: id,
				checked: checked
			});
		},

		uploadFiles(curFiles, files){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADING_FILES
			});
			EventEditAPI.uploadFiles(curFiles, files).then((uploadedFiles) => {
				var filesWithoutErrors = filter(uploadedFiles, (file) => {
					return file.error === '';
				});

				/*if (isErrors) {
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADING_FILES_ERROR,
						error: "Не удалось загрузить файлы"
					});
				}*/
				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADED_FILES,
					files: filesWithoutErrors
				});
				/*if (data && !data.error) {
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADED_FILES,
						id: data.id,
						name: data.name
					});
				}
				else {
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADING_FILE_ERROR,
						error: data.error
					});
				}*/
				
			}, function(error){
				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADING_FILE_ERROR,
					error: error
				});
			})
		},

		uploadLibraryMaterials(curLibraryMaterials, libraryMaterials){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADING_LIBRARY_MATERIALS
			});
			EventEditAPI.uploadLibraryMaterials(curLibraryMaterials, libraryMaterials).then((uploadedlibraryMaterials) => {
				/*var filesWithoutErrors = filter(uploadedlibraryMaterials, (file) => {
					return file.error === '';
				});*/

				/*if (isErrors) {
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADING_FILES_ERROR,
						error: "Не удалось загрузить файлы"
					});
				}*/
				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADED_LIBRARY_MATERIALS,
					libraryMaterials: uploadedlibraryMaterials
				});
				/*if (data && !data.error) {
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADED_FILES,
						id: data.id,
						name: data.name
					});
				}
				else {
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADING_FILE_ERROR,
						error: data.error
					});
				}*/
				
			}, function(error){
				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_FILES_UPLOADING_LIBRARY_MATERIALS_ERROR,
					error: error
				});
			})
		},

		removeFiles(ids){
			EventEditAPI.removeFiles(ids).then((files) => {
				var filesWithoutErrors = filter(files, (file) => {
					return file.error === '';
				});

				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_FILES_REMOVE_FILES,
					files: filesWithoutErrors
				})
				/*if (error !== ''){
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_FILES_REMOVE_FILES_ERROR,
						error: error
					});
				}
				else {
					AppDispatcher.handleAction({
						actionType: EventEditConstants.EVENTEDIT_FILES_REMOVE_FILES,
						id: id
					});
				}*/
			});
		},

		updateFiles(files){
			EventEditAPI.updateFiles(files).then((files) => {
				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_FILES_UPDATE_FILES,
					files: files
				});
			});
		},

		updateLibraryMaterials(libraryMaterials){
			EventEditAPI.updateLibraryMaterials(libraryMaterials).then((libraryMaterials) => {
				AppDispatcher.handleAction({
					actionType: EventEditConstants.EVENTEDIT_FILES_UPDATE_LIBRARY_MATERIALS,
					libraryMaterials: libraryMaterials
				});
			});
			
		},

		changeInfoMessageLibraryMaterials(message, status){
			AppDispatcher.handleAction({
				actionType: EventEditConstants.EVENTEDIT_FILES_CHANGE_INFO_MESSAGE_LIBRARY_MATERIALS,
				message: message,
				status: status
			});
		}
	}
}

module.exports = EventEditActions;