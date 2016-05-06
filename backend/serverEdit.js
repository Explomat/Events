<%

/* 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-----
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------  КОНСТАНТЫ  -----------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

CUR_USER_DOC = OpenDoc(UrlFromDocID(curUserID));
LIBRARY_UPLOAD_SECTION_ID = 6273792921854941289; // Раздел библиотеки - "Материалы для мероприятий"
LIBRARY_MATERILA_TYPE_ID = 5956480485185946715; // Вид материала библиотеки - "Тренинговый материал"
LIBRARY_DEFAULT_ORIENTATION = 'vertical'; // Ориентация материала библиотеки - "Вертикальная"
LIBRARY_MATERIAL_FORMAT_ID = 5974338485996577346; // Формат материала библиотеки - "Документ"

DEFAULT_EDUCATION_ORGS = [
	{ id: '5919417932074195731', name : 'Учебный центр MERLION'}, 
	{ id: '5929396429688827825', name : 'ОоИР'}
];
TEST_RESULT_THRESHOLDS = [ 0, 50, 80, 100 ];

/* 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------- Вспомогательные функции  -----------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/


//Загрузка файла (внутреняя функция)
function _uploadFile(queryObjects) {

	function _addLink () {
		resoureLink = docResource.TopElem.links.AddChild(); 
		resoureLink.object_id = Session.eventId ;
		resoureLink.object_catalog = 'event';
		resoureLink.object_name = Session.eventName;
		resoureLink.date_modify = Date();
	}

	var file = queryObjects.Form.file;
	if (file == null || file == undefined) {
		return {
			id: null, 
			name: null, 
			error: "Нет файла для загрузки!"
		}
	}

	var fileName = file.FileName + '';
	var lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex == -1) {
		lastDotIndex = fileName.length - 1;
	}

	var fileType = fileName.substr(lastDotIndex + 1, fileName.length - lastDotIndex);

	var error = '';

	try {
		var docResource = tools.new_doc_by_name('resource');		 
		docResource.TopElem.person_id = curUserID; 
		docResource.TopElem.allow_unauthorized_download = true; 
		docResource.TopElem.allow_download = true; 
		docResource.TopElem.file_name = fileName;
		docResource.TopElem.name = fileName;
		docResource.TopElem.type = fileType;
		docResource.TopElem.person_fullname = CUR_USER_DOC.TopElem.fullname;
		docResource.BindToDb();
		_addLink();
		docResource.TopElem.put_str(queryObjects.Body, fileName); 
		docResource.Save();
	}catch(e){
		error = e;
	}
	return { 
		id: docResource.DocID, 
		name: fileName,
		type: fileType,
		isAllowDownload: docResource.TopElem.allow_download + '',
		error: error 
	}
}

//Загрузка файла (для вызова с клиента)
function uploadFile(queryObjects) {
	var currentFile = _uploadFile(queryObjects);
	return tools.object_to_text(currentFile,'json');
}

function uploadLibraryMaterial(queryObjects) {
	var currentObject = _uploadFile(queryObjects);
	var error = '';

	docResource = tools.new_doc_by_name('library_material');
	docResource.TopElem.code = 'CITILINK';
	docResource.TopElem.name = currentObject.name; 
	docResource.TopElem.section_id = LIBRARY_UPLOAD_SECTION_ID; 
	docResource.TopElem.library_material_type_id = LIBRARY_MATERILA_TYPE_ID; 
	docResource.TopElem.unfolded_document.orientation = LIBRARY_DEFAULT_ORIENTATION;  
	docResource.TopElem.file_name = currentObject.id;
	docResource.TopElem.author = CUR_USER_DOC.TopElem.firstname + ' ' + CUR_USER_DOC.TopElem.lastname;
	docResource.TopElem.year = Year(Date());
	newmaterialView = docResource.TopElem.library_material_formats.AddChild(); 
	newmaterialView.library_material_format_id = LIBRARY_MATERIAL_FORMAT_ID;  
	docResource.BindToDb(); 
	docResource.Save();

	if (ArrayOptFirstElem(docResource.TopElem.unfolded_document.pages) != undefined) {
		docResource.TopElem.unfolded_document.pages.Clear();
		docResource.Save();
	}
	
	try {
		docMaterialResult = ServerEval('tools.convert_pdf_libratry_material(' + docResource.TopElem.Doc.DocID + ')');
		if(docMaterialResult != null)
		{
			docResource.TopElem.AssignElem(OpenDoc(UrlFromDocID( docResource.DocID )).TopElem);					
			alert('конвертация завершена удачно');	
		} else {
			alert('ошибка')					
		}
	}
	catch(x)
	{		
		error = x;
		return "ошибка ри конвертации материала бибилотеки, текст ошибки : " + x ;	
	}

	docResource.TopElem.allow_download = true;
	docResource.Save();

	return tools.object_to_text({
		id : docResource.DocID + '',
		name : docResource.name + '', 
		year : docResource.year + '',
		author : docResource.TopElem.author + '',
		error: error 
	} ,'json')
}

function removeFiles(queryObjects) {

	var data = tools.read_object(queryObjects.Body);
	var filesArray = data.HasProperty('ids') ? data.ids : [];
	var files = [];

	var eventCard = OpenDoc(UrlFromDocID(Session.eventId));
	for (file in filesArray) {
		doc = ArrayOptFirstElem(XQuery('sql:select r.id from resource r where r.id=' + file));
		if (doc != undefined) {
			fileCard = OpenDoc(UrlFromDocID(doc.id));
			for (i = 0; i < ArrayCount(eventCard.TopElem.files); i++) {
				try {
					if ( eventCard.TopElem.files[i].file_id == Int(file) ) {
						eventCard.TopElem.files[i].Delete();
						eventCard.Save();
						
						files.push({
							id : file + '',
							error : ''
						})
						if ( ArrayCount(fileCard.TopElem.links) == 1 && fileCard.TopElem.links[0].object_id == Int(Session.eventId) ) {
							DeleteDoc( UrlFromDocID( doc.id ) )
						} else if ( ArrayCount(fileCard.TopElem.links) == 0 ) {
							DeleteDoc( UrlFromDocID( doc.id ) )
						}
					} 
				} catch (e) { 
					files.push({
						id : file + '',
						error : e
					}) 
				}
			}
		}
	}
	return tools.object_to_text(files, 'json');
}

function addFiles (queryObjects) {

	function _isExist(files, fileId){
		for (f in files){
			if ( Int(f.file_id) == Int(fileId) ) {
				return true;
			}
		}
		return false;
	}

	var data = tools.read_object(queryObjects.Body);
	var curEventCard = OpenDoc(UrlFromDocID(Int(Session.eventId)));

	var goodData = [];

	for (elem in data.files) {
		isFileExist = _isExist(curEventCard.TopElem.files, elem.id);
		if (!isFileExist) {
			resoureLink = curEventCard.TopElem.files.AddChild();
			resoureLink.file_id = Int(elem.id) ;
			resoureLink.visibility = 'all';
			curEventCard.Save();
		} 
		goodData.push(elem);
	}
	return tools.object_to_text(goodData, 'json');
}

function addLibraryMaterials (queryObjects) {

	function _isExist(files, fileId){
		for (f in files){
			if ( Int(f) == Int(fileId) ) {
				return true;
			}
		}
		return false;
	}

	var data = tools.read_object(queryObjects.Body);
	var curEventCard = OpenDoc(UrlFromDocID(Int(Session.eventId)));
	var curValue = curEventCard.TopElem.custom_elems.ObtainChildByKey('allMaterials').value;
	var materialsArray = [];
	var resultArray = [];
	if (curValue != '') {
		materialsArray  = String(curValue).split(';');
	} 
   
	for (elem in data.files) {
			name = elem.name == '' ? "Безимянный" : elem.name;
			year = elem.year == null ? Year(Date()) : elem.year;
			author = elem.author == '' ? OpenDoc(UrlFromDocID(elem.doc_info.creation.user_id)).TopElem.fullname : elem.author;
		if (!_isExist(materialsArray, elem.id) ) {
			materialsArray.push(elem.id);
			resultArray.push({
				id : Int(elem.id),
				name : name + '',
				year : year + '',
				author : author + ''
			})
		} else {
			resultArray.push({
				id : Int(elem.id),
				name : name + '',
				year : year + '',
				author : author + ''
			})
		}
	}
	materialsArray = [];
	for (el in resultArray) {
		materialsArray.push(el.id)
	}

	curEventCard.TopElem.custom_elems.ObtainChildByKey('allMaterials').value = materialsArray.join(';');
	curEventCard.Save();
	return tools.object_to_text(resultArray, 'json');

}

function isAdmin (queryObjects) {

	var curPersonCard = OpenDoc(UrlFromDocID(curUserID))
	var curEventCard  = queryObjects.HasProperty('event_id') ? OpenDoc(UrlFromDocID(Int(queryObjects.event_id))) : null
	
	function _isCreator(curEventCard) {
		return curEventCard.TopElem.doc_info.creation.user_id == curUserID
	}

	function _isTutor(curEventCard) {
		return ArrayOptFind(curEventCard.TopElem.tutors, 'collaborator_id == curUserID') == undefined ? false : true
	}

	function _isAdmin() {
		return curPersonCard.TopElem.last_data.access_role == admin ? true : false
	}

	return curEventCard != null && ( _isCreator(curEventCard) || _isTutor(curEventCard) || _isAdmin());
}


function createNotification (queryObjects) {
	var data = tools.read_object(queryObjects.Body);

	var ids =  data.HasProperty('ids') ?  data.ids : null;
	var subject = data.HasProperty('subject') ? data.subject : null ;
	var messeageText = data.HasProperty('body') ? data.body : null ;
	try {
		var senderAdress = OpenDoc(UrlFromDocID(curUserID)).TopElem;
	} catch (e) {
		return "Не корректный ID сотрудника (отправителя) уведомления - текст ошибки : " + e;

	}
	var badPersonArray = [];
	var notSendRequest = 0;

	if ( ids !== null  && subject !== null && messeageText !== null ) {
		for (elem in ids) {
			try {
				curUserCardTE = OpenDoc(UrlFromDocID(Int(elem))).TopElem
			} catch (e) {
				return "Не корректный ID сотрудника, (получателя) уведомления - текст ошибки : " + e;
			}
			if (curUserCardTE) {
				cardDoc = OpenNewDoc("x-local://wtv/wtv_active_notification.xmd");
				cardDoc.TopElem.is_custom ='1';
				cardDoc.TopElem.status ='active';
				cardDoc.TopElem.sender.address = senderAdress.email;
				cardDoc.TopElem.sender.name = senderAdress.fullname;
				cardDoc.TopElem.subject = subject;
				cardDoc.TopElem.body = messeageText;
				cardDoc.TopElem.body_type = "html";
				cardDoc.TopElem.recipients.AddChild("recipient");
				cardDoc.TopElem.recipients[0].address = curUserCardTE.email;
				cardDoc.TopElem.send_date = Date();
				cardDoc.BindToDb();
				cardDoc.Save();
			} else {
				curPersonFIO = curUserCardTE.fullname;
				badPersonArray.push(curPersonFIO);
				notSendRequest++; 
			}
			
		}
	}
	if ( notSendRequest > 0 ) {
		return tools.object_to_text ({
			notSendRequest : notSendRequest,
			badPersonArray : badPersonArray
		}, 'json');
	}
}

function processingRequest(queryObjects) {
	var data = tools.read_object(queryObjects.Body);

	var status = data.HasProperty('status') ? data.status : null;
	var request_id = data.HasProperty('id') ? Int(data.id) : null;
	var reason = data.HasProperty('reason') ? data.reason : null;
	try {
		var curRequestCard = OpenDoc(UrlFromDocID(request_id));
	} catch (e) {
		return "Не корректный ID заявки - текст ошибки : " + e;
	}

	if (request_id != null && status != null ) {
		if (status == 'close') {
			tools.close_request(request_id); 
			curRequestCard.TopElem.workflow_state = 'sfi0o2';
		} else {
			requestDoc = tools.request_rejecting(request_id);
			curRequestCard.TopElem.workflow_state = 's9v8gw';
			curRequestCard.TopElem.comment = reason;
			tools.create_notification('Merlion_19', request_id )
		}
		curRequestCard.Save();
	}

}




/* 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------- Получаем данные по определенному каталогу  -----------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

function getDataForNewEvent (queryObjects) {
	return tools.object_to_text({ 
		base : {
			educationOrgs : DEFAULT_EDUCATION_ORGS
			}
	} , 'json');
}

function forLiveSearchGetEducationMethods (queryObjects) {
	var limitRows = queryObjects.HasProperty('limit') ? queryObjects.limit : 5;
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var eduMethods = [];
	var eduMethodsArray = XQuery("sql:select 
			top " + limitRows + " education_methods.id, 
			REPLACE(education_methods.name,'\"', '' ) as name,
			education_methods.education_org_id
			from 
				education_methods
			where
				education_methods.name LIKE '%"+filterText+"%'	 
			order by 
				education_methods.name asc");

		for ( edu in eduMethodsArray ) {
			descr = OpenDoc(UrlFromDocID(edu.education_org_id)).TopElem.name;
			eduMethods.push({ 
				payload: Int(edu.id), 
				value: edu.name + '', 
				description: descr + ''
			});
		}
	return tools.object_to_text( eduMethods , 'json');
}

function forLiveSearchGetLectors (queryObjects) {
	var limitRows = queryObjects.HasProperty('limit') ? queryObjects.limit : 5;
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';
	var type = queryObjects.HasProperty('type') ? queryObjects.type : '';

	var lectors = [];
	var lectorsArray = XQuery("sql:select 
			top " + limitRows + " lectors.id, 
			REPLACE(lectors.lector_fullname,'\"', '' ) as name,
			lectors.type
			from 
				lectors
			where
				lectors.lector_fullname LIKE '%"+filterText+"%' and
				lectors.type LIKE '%"+type+"%'	 
			order by 
				lectors.lector_fullname asc");

		for ( lect in lectorsArray ) {
			decsr = lect.type == 'collaborator' ? 'Внутренний' : 'Внешний';
			lectors.push({ 
				payload: Int(lect.id), 
				value: lect.name + '', 
				description: decsr + ''
			});
		}
	return tools.object_to_text( lectors , 'json');
}

function forLiveSearchGetPlaces (queryObjects) {
	var limitRows = queryObjects.HasProperty('limit') ? queryObjects.limit : 5;
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var places = [];
	var placesArray = XQuery("sql:select 
			top " + limitRows + " p.id, 
			REPLACE(p.name,'\"', '' ) as name,
			p.parent_id, 
			r.name as region_name 
			from 
				places p left join regions r on p.region_id=r.id
			where
				p.name LIKE '%"+filterText+"%'	 
			order by 
				p.name asc");

		for ( pl in placesArray ) {
			places.push({ 
				payload: Int(pl.id), 
				value:pl.name + '', 
				description: pl.region_name + ''
			});
		}
	return tools.object_to_text( places , 'json');
}

function forLiveSearchGetCollaborators (queryObjects) {
	var limitRows = queryObjects.HasProperty('limit') ? queryObjects.limit : 5;
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var basicCollaboratorsArray = XQuery("sql:select
			top " + limitRows + " CONVERT(BIGINT, collaborators.id) as id, 
			REPLACE(collaborators.fullname, '\"', '') as name,
			collaborators.position_parent_name as subdivision,
			collaborators.position_name as position
			from 
				collaborators
			where 
				collaborators.fullname LIKE '%"+filterText+"%' and
				collaborators.is_dismiss = 'false' 
			order by 
				collaborators.fullname asc");

	var collaboratorsArray = [];
	for (colab in basicCollaboratorsArray) {
		collaboratorsArray.push({ 
			payload: Int(colab.id),
			value: colab.name + '', 
			description: String(colab.subdivision+' / '+colab.position)		 
		});
	}
	return tools.object_to_text( collaboratorsArray , 'json');
}

function getCollaborators (queryObjects) {
	var limitRows = 20; // кол-во выдаваемых записей
	var startPage = queryObjects.HasProperty('page') ? Int(queryObjects.page) - 1 : 0; 
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var queryPageCount = XQuery("sql:select 
			COUNT(*)/"+limitRows+" pagesCount 
		from 
			collaborators 
		where
			collaborators.is_dismiss = 'false' and
			collaborators.fullname LIKE '%"+filterText+"%'");
	queryPageCount = Int(ArrayOptFirstElem(queryPageCount).pagesCount)

	var basicCollaboratorsArray = XQuery("sql:select
			top " + limitRows + " CONVERT(BIGINT, c.id) as id, 
			REPLACE(c.fullname, '\"', '') as name,
			c.position_parent_name as subdivision,
			c.position_name as position
		from (
			select ROW_NUMBER() OVER(ORDER BY collaborators.fullname) rowNum,* 
			from collaborators
			where 
			collaborators.fullname LIKE '%"+filterText+"%' and
			collaborators.is_dismiss = 'false'
		) c
		where 
			c.rowNum > " + startPage * limitRows);

	var collaboratorsArray = [];
	for (colab in basicCollaboratorsArray) {
		collaboratorsArray.push({ 
			id: Int(colab.id),
			data: {
				fullname: colab.name + '', 
				subdivision: colab.subdivision+'', 
				position: colab.position + ''
			} 			 
		});
	}
	return tools.object_to_text({
		pagesCount: queryPageCount + 1,
		items: collaboratorsArray,
		headerCols: [
			{'name' : 'ФИО пользователя', 'type':'string' },
			{'name' : 'Подразделение', 'type':'string' },
			{'name' : 'Должность', 'type':'string' }
		]
	}, 'json');
}

function getTests (queryObjects) {
	var limitRows = 20;
	var startPage = queryObjects.HasProperty('page') ? Int(queryObjects.page) - 1 : 0; 
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var queryPageCount = XQuery("sql:select 
		COUNT(*)/"+limitRows+" pagesCount 
		from 
			assessments 
		where 
			(assessments.code = 'ALL_TESTS' or assessments.code = 'CITILINK_TESTS' or assessments.code = 'MERLION_TESTS') and
		assessments.passing_score > 0 and
		assessments.title LIKE '%"+filterText+"%'");
	queryPageCount = Int(ArrayOptFirstElem(queryPageCount).pagesCount)

	var basicTestsArray = XQuery("sql:select 
		top " + limitRows + " t.id, 
		REPLACE(t.title, '\"', '') as name, 
		t.code as code 
		from (
			select ROW_NUMBER() OVER(ORDER BY assessments.title) rowNum,* 
			from 
				assessments
			where 
				assessments.title LIKE '%"+filterText+"%' and
				(assessments.code = 'ALL_TESTS' or assessments.code = 'CITILINK_TESTS' or assessments.code = 'MERLION_TESTS') and
				assessments.passing_score > 0
		) t
		where 
			t.rowNum > " + startPage * limitRows);

	var testsArray = [];
	for (t in basicTestsArray) {
		t.code = (t.code == 'ALL_TESTS') ? 'Для всех' : (t.code == 'CITILINK_TESTS') ? 'Ситилинк' : 'Мерлион';
		testsArray.push({ 
			id: Int(t.id), 
			data: {
				name : t.name + '',
				code: t.code + ''
			}
		});
	}
	return tools.object_to_text({
		pagesCount: queryPageCount + 1,
		items: testsArray,
		headerCols: [
			{'name' : 'Название теста', 'type':'string' },
			{'name' : 'Тип бизнесса', 'type':'string' }
		]
	}, 'json');
}

function getLectors (queryObjects) {
	var limitRows = 20;
	var startPage = queryObjects.HasProperty('page') ? Int(queryObjects.page) - 1 : 0; 
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var queryPageCount = XQuery("sql:select 
		COUNT(*)/"+limitRows+" pagesCount 
		from 
			lectors ");
	queryPageCount = Int(ArrayOptFirstElem(queryPageCount).pagesCount)

	var basicLectorsArray = XQuery("sql:select 
		top " + limitRows + " l.id, 
		REPLACE(l.lector_fullname, '\"', '') as name, 
		l.type as type 
		from (
			select ROW_NUMBER() OVER(ORDER BY lectors.lector_fullname) rowNum,* 
			from 
				lectors
			where 
				lectors.lector_fullname LIKE '%"+filterText+"%'
		) l
		where 
			l.rowNum > " + startPage * limitRows);

	var lectorsArray = [];
	for (l in basicLectorsArray) {
		/*l.type = (l.type == 'invitee') ? 'Внешний' : 'Внутренний';*/
		type = (l.type == 'invitee') ? 'Внешний' : 'Внутренний';
		lectorsArray.push({ 
			id: Int(l.id), 
			data: {
				fullname : l.name + '',
				type: type + ''
			},
			additionalData: {
				type: l.type + ''
			}
		});
	}
	return tools.object_to_text({
		pagesCount: queryPageCount + 1,
		items: lectorsArray,
		headerCols: [
			{'name' : 'ФИО преподавателя', 'type':'string' },
			{'name' : 'Тип преподавателя', 'type':'string' }
		]
	}, 'json');
}

function getCourses (queryObjects) {
	var limitRows = 20;
	var startPage = queryObjects.HasProperty('page') ? Int(queryObjects.page) - 1 : 0; 
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var queryPageCount = XQuery("sql:select 
		COUNT(*)/"+limitRows+" pagesCount 
		from 
			courses 
		where 
			courses.code <> 'НЕ НАЗНАЧАТЬ' ");
	queryPageCount = Int(ArrayOptFirstElem(queryPageCount).pagesCount)

	var basicCoursesArray = XQuery("sql:select 
		top " + limitRows + " c.id, 
		REPLACE(c.name, '\"', '') as name 
		from (
			select ROW_NUMBER() OVER(ORDER BY courses.name) rowNum,* 
			from 
				courses
			where 
				courses.name LIKE '%"+filterText+"%' and
				courses.code <> 'НЕ НАЗНАЧАТЬ' 
		) c
		where 
			c.rowNum > " + startPage * limitRows);

	var coursesArray = [];
	for (c in basicCoursesArray) {
		coursesArray.push({ 
			id: Int(c.id), 
			data: {
				name : c.name + ''
			}
		});
	}
	return tools.object_to_text({
		pagesCount: queryPageCount + 1,
		items: coursesArray,
		headerCols: [
			{'name' : 'Название курса', 'type':'string' }
		]
	}, 'json');
}



function getFiles (queryObjects) {

	var limitRows = 20;
	var startPage = queryObjects.HasProperty('page') ? Int(queryObjects.page) - 1 : 0; 
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var queryPageCount = XQuery("sql:select 
		COUNT(*)/"+limitRows+" pagesCount 
		from 
			resources
		where
			resources.name LIKE '%"+filterText+"%'");
	queryPageCount = Int(ArrayOptFirstElem(queryPageCount).pagesCount)

	var basicRecourseArray = XQuery("sql:select 
		top " + limitRows + " r.id, 
		REPLACE(r.name, '\"', '') as name,
		r.type,
		r.allow_download
		from (
			select ROW_NUMBER() OVER(ORDER BY resources.name) rowNum,* 
			from 
				resources
			where 
				resources.name LIKE '%"+filterText+"%'
		) r
		where 
			r.rowNum > " + startPage * limitRows);

	var resourcesArray = [];
	for (r in basicRecourseArray) {
		resourcesArray.push({ 
			id: Int(r.id), 
			data: {
				name : r.name + '',
				type: r.type + ''
			},
			additionalData: {
				isAllowDownload: r.allow_download + ''
			}
		});
	}
	return tools.object_to_text({
		pagesCount: queryPageCount + 1,
		items: resourcesArray,
		headerCols: [
			{'name': 'Название файла', 'type': 'string' },
			{'name': 'Тип', 'type': 'string'}
		]
	}, 'json');
}

function getLibraryMaterials (queryObjects) {
	var limitRows = 20;
	var startPage = queryObjects.HasProperty('page') ? Int(queryObjects.page) - 1 : 0; 
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var queryPageCount = XQuery("sql:select 
		COUNT(*)/"+limitRows+" pagesCount 
		from 
			library_materials 
		where 
			library_materials.year <> '' and
			library_materials.name LIKE '%"+filterText+"%'");
	queryPageCount = Int(ArrayOptFirstElem(queryPageCount).pagesCount)

	var basicLibraryMaterialsArray = XQuery("sql:select 
		top " + limitRows + " l.id,
		l.year as year,
		l.author as author, 
		REPLACE(l.name, '\"', '') as name 
		from (
			select ROW_NUMBER() OVER(ORDER BY library_materials.name) rowNum,* 
			from 
				library_materials
			where 
				library_materials.name LIKE '%"+filterText+"%' and
				library_materials.year <> '' 
		) l
		where 
			l.rowNum > " + startPage * limitRows);
	var libraryMaterialsArray = [];
	for (l in basicLibraryMaterialsArray) {
		curItemAuthor = l.author == null ? "отсутсвует" : l.author;
		libraryMaterialsArray.push({
			id: Int(l.id), 
			data: {
				name : l.name + '',
				year : l.year + '',
				author : curItemAuthor + ''
			}
		});
	}
	return tools.object_to_text({
		pagesCount: queryPageCount + 1,
		items: libraryMaterialsArray,
		headerCols: [
			{'name' : 'Название материала',	'type':'string'},
			{'name' : 'Год','type':'integer'},
			{'name' : 'Автор','type':'string'}
		]
	},'json');
}

function getEducationMethod (queryObjects) {
	var limitRows = 20;
	var startPage = queryObjects.HasProperty('page') ? Int(queryObjects.page) - 1 : 0; 
	var filterText = queryObjects.HasProperty('search') ? queryObjects.search : '';

	var queryPageCount = XQuery("sql:select 
		COUNT(*)/"+limitRows+" pagesCount 
		from education_methods
		where education_methods.name LIKE '%"+filterText+"%'");

	queryPageCount = Int(ArrayOptFirstElem(queryPageCount).pagesCount)

	var basiceducationMethodsArray = XQuery("sql:select 
		top " + limitRows + " ed.id, 
		REPLACE(ed.name, '\"', '') as name 
		from (
			select ROW_NUMBER() OVER(ORDER BY education_methods.name) rowNum,* 
			from 
				education_methods
			where 
				education_methods.name LIKE '%"+filterText+"%'
		) ed
		where 
			ed.rowNum > " + startPage * limitRows);

	var educationMethodsArray = [];
	for (ed in basiceducationMethodsArray) {
		educationMethodsArray.push({ 
			id: Int(ed.id), 
			data: {
				name : ed.name + ''
			}
		});
	}
	return tools.object_to_text({
		pagesCount: queryPageCount + 1,
		items: educationMethodsArray,
		headerCols: [
			{'name' : 'Название программы', 'type':'string' }
		]
	},'json');
}

/* 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------- Получаем данные по конкретному мероприятию -----------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

function getEventLibraryMaterials (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;
	try {
		var eventDocTE = OpenDoc(UrlFromDocID(Int(eventID))).TopElem; 
	} catch (e) {
		return "Не корректный ID мероприятия, текст ошибки : " + e;
	}
	var meterialArrayFieldValue = eventDocTE.custom_elems.ObtainChildByKey('allMaterials').value;
	var resultArray = [];
	if (meterialArrayFieldValue != '') {
		var libraryMaterials = String(meterialArrayFieldValue).split(';');
		for (material in libraryMaterials) {
			try {
				materialID = Int(material);
				curMaterial = OpenDoc(UrlFromDocID(materialID)).TopElem;
			} catch (e) {
				return "Не корретктный ID материала бибилотеки (доп. поле - allMaterials)";
			}
			name = curMaterial.name == '' ? "Безимянный" : curMaterial.name;
			year = curMaterial.year == null ? Year(Date()) : curMaterial.year;
			try {
				author = curMaterial.author == '' ? OpenDoc(UrlFromDocID(curMaterial.doc_info.creation.user_id)).TopElem.fullname : curMaterial.author;	
			} catch (e) {
				return "Не кореектный ID создателя материала библиотеки"
			}
			resultArray.push({
				id : materialID,
				name : name + '',
				year : year + '',
				author : author + ''
			})
		} 
	}
	 return resultArray;
}



function getEventRequests (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;
	try {
		var eventDocTE = OpenDoc(UrlFromDocID(eventID)).TopElem; 
	} catch (e) {
		return "Не корректный ID меропирятия (заявки мероприятия), текст ошибки : " + e;
	}
	basicRequestsArray = XQuery("sql: select 
		requests.id as id,
		requests.status_id as status,
		requests.person_fullname as fullname,
		requests.person_id as personId,
		colab.position_name as position,
		colab.position_parent_name as subdivision
	from
		requests
		inner join collaborators as colab on requests.person_id = colab.id
	where
		(requests.workflow_state = 'schhk0' or
		requests.workflow_state = 's9v8gw' or
		requests.workflow_state = 'sfi0o2') and
		requests.type = 'event' and
		requests.object_id = " + eventID + "
		order by requests.person_fullname asc");
	
	var requestsArray = [];
	for (r in basicRequestsArray) {
		requestsArray.push({ 
			id: Int(r.id), 
			fullname : r.fullname + '',
			subdivision: r.subdivision + '',
			position: r.position + '',
			status: r.status + ''
		});
	}

	var date_request_begin = eventDocTE.date_request_begin == null ? Date() : eventDocTE.date_request_begin;
	var date_request_over = eventDocTE.date_request_over == null ? Date() : eventDocTE.date_request_over;
	var isApproveByBoss = eventDocTE.custom_elems.ObtainChildByKey('func_manager_accept').value == 'true' ? true : false;
	var isApproveByTutor = eventDocTE.custom_elems.ObtainChildByKey('main_tutor_accept').value == 'true' ? true : false;
	return {
		isOpen : eventDocTE.is_open + '',
		requestBeginDate : StrMimeDate(date_request_begin) + '',
		requestOverDate : StrMimeDate(date_request_over) + '',
		isApproveByBoss : isApproveByBoss + '',
		isApproveByTutor : isApproveByTutor + '',
		requestItems: requestsArray
	}
}

function getEventTests (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;
	try {
		var eventDocTE = OpenDoc(UrlFromDocID(eventID)).TopElem; 
	} catch (e) {
		return "Не корректный ID меропирятия (тесты мероприятия), текст ошибки : " + e;
	}

	var isPostTestOnlyForAssisst = eventDocTE.custom_elems.ObtainChildByKey('post_test_for_assisst').value == 'true' ? true : false;
	var prevTests = [];
	var postTests = [];
	for (assessment in eventDocTE.prev_testing.assessments) {
		prevTests.push({
			id : Int(assessment.assessment_id),
			name : assessment.assessment_id.ForeignElem.title + '',
			type : 'prev'
		})
	}

	for (assessment in eventDocTE.post_testing.assessments) {
		postTests.push({
			id : Int(assessment.assessment_id),
			name : assessment.assessment_id.ForeignElem.title + '',
			type : 'post'
		})
	}


	basicActiveTestsArray = XQuery("sql: select 
		active_test_learnings.id as id,
		active_test_learnings.person_id as personId,
		active_test_learnings.person_fullname as personFIO, 
		active_test_learnings.assessment_name as assessment_name,
		active_test_learnings.score as score,
		0 as maxscore
	from
		active_test_learnings
	where
		active_test_learnings.event_id = " + eventID + "
	UNION
	select 
		test_learnings.id as id,
		test_learnings.person_id as personId,
		test_learnings.person_fullname as personFIO,
		test_learnings.assessment_name as assessment_name,
		test_learnings.score as score,
		test_learnings.max_score as maxscore
	from
		test_learnings
	where
		test_learnings.event_id =" + eventID + "
	order by personFIO asc");


	var testsArray = [];
	for (at in basicActiveTestsArray) {
		testsArray.push({ 
			id : Int(at.id), 
			fullname : at.personFIO + '',
			assessmentName : at.assessment_name + '',
			score : at.score + '',
			maxscore : at.maxscore + ''
		});
	}
	return {
		allTests : ArrayUnion(prevTests, postTests),
		isPostTestOnlyForAssisst : isPostTestOnlyForAssisst + '',
		testingList: testsArray,
		thresholds: TEST_RESULT_THRESHOLDS
	}
}

function getEventCourses (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null; 

	if (eventID) {
		basicActiveCoursesArray = XQuery("sql: select 
			active_learnings.id as id,
			active_learnings.person_id as personId,
			active_learnings.person_fullname as personFIO, 
			active_learnings.assessment_name as assessment_name,
			active_learnings.state_id as status,
			active_learnings.score as score
		from
			active_learnings
		where
			active_learnings.event_id = " + eventID + "
		UNION
		select 
			learnings.id as id,
			learnings.person_id as personId,
			learnings.person_fullname as personFIO,
			learnings.assessment_name as assessment_name,
			learnings.state_id as status,
			learnings.score as score
		from
			learnings
		where
			learnings.event_id =" + eventID + "
		order by personFIO asc");
	

		var requestsArray = [];
		for (ac in basicActiveCoursesArray) {
			requestsArray.push({ 
				id: Int(ac.id), 
				fullname : ac.personFIO + '',
				assessmentName: ac.assessment_name + '',
				status: ac.status + '',
				score: ac.score + ''
			});
		}
		return {
			courses: requestsArray
		}
	} else {
		return "Не корреткный ID мероприятия";
	}
}

function getEventFiles (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null; 

	if (eventID != null) {
		var filesArray = [];
		var basicFilesArray = OpenDoc(UrlFromDocID(eventID)).TopElem.files;
		for (f in basicFilesArray) {
			try {
				curFile = OpenDoc(UrlFromDocID(f.file_id)).TopElem;
			} catch (e) {
				return "Не корреткный ID файла в мероприятии, текст ошибки : " + e;
			}			
			filesArray.push({
				id: Int(f.file_id),
				name: curFile.name + '',
				type: curFile.type + '',
				isAllowDownload : curFile.allow_download + ''
			});
		}

		var lm = getEventLibraryMaterials(queryObjects);

		return {
			files: filesArray,
			libraryMaterials: lm
		}
	} else {
		return "Не корреткный ID мероприятия";
	}
}

function getEventPlaces(queryObjects) {

	function _filterTrees(trees) {
		for (var i = 0; i < trees.length; i++) {
			curNode = trees[i];
			if (curNode.HasProperty('children')) {
				trees[i] = { id:curNode.id, name: curNode.name, descr:curNode.descr, children:curNode.children };
				_filterTrees(curNode.children);
			}
			else
				trees[i] = { id:curNode.id, name:curNode.name, descr:curNode.descr };
		}
	}

	function _getChildren(arr, id) {
		var children = [];
		for (var ch = arr.length - 1; ch >= 0; ch--) {
			child = arr[ch];
			if (!child.checked) {
				if (String(id) == String(child.parentId)) {
					children.push(child);
					child.checked = true;
				}
			}
		}
		return children;
	}

	function _getGraphs(arr) { 
		for (var nId = 0; nId < arr.length; nId++){
			node = arr[nId];
			stack = [ node ];
			while(stack.length > 0) {
				_node = stack[stack.length - 1];
				stack.splice(stack.length - 1, 1);
				children = _getChildren(arr, _node.id);
				if (children.length > 0) {
					_node.children = children;
					for (i = children.length - 1; i >= 0; i--) {
						stack.push(children[i]);
					};
				}
			}
		}
		return arr;
	}

	function _getTree(arr){
		var  allGraphs = _getGraphs(arr);
		var trees = [];
		for (var i = allGraphs.length - 1; i >= 0; i--) {
			_node = allGraphs[i];
			if (!_node.checked)
				trees.push(_node); 
		};
		_filterTrees(trees);
		return trees;
	}

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;
	try {
		var eventDocTE = OpenDoc(UrlFromDocID(eventID)).TopElem; 
	} catch (e) {
		return "Некорректный ID меропирятия (расположение мероприятия), текст ошибки : " + e;
	}
	var places = [];
	for (pl in XQuery("sql:select p.id, REPLACE(p.name,'\"', '' ) as name, p.parent_id, r.name as region_name from places p left join regions r on p.region_id=r.id order by p.name desc")){
		id = pl.id == null ? 'null' : pl.id + '';
		name = pl.name == null ? 'null' : pl.name + '';
		parentId = pl.parent_id == null ? 'null' : pl.parent_id + '';
		regionName = pl.region_name == null ? '' : pl.region_name + '';
		places.push({ id:id, name:name, parentId:parentId, descr: regionName, checked:false });
	}

	var tree = _getTree(places);
	var selectedNode = null;
	if (eventDocTE.place_id.HasValue) {
		selectedNode = {
			id : eventDocTE.place_id + '', 
			name : eventDocTE.place_id.ForeignElem.name + ''
		}
	}

	return {
		selectedNode: selectedNode,
		nodes: tree
	}
}

function getEventBaseData (queryObjects) {
	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;
	if ( eventID ) {
		var eventsArray = XQuery("sql: select 
			REPLACE(events.name,'\"', '''' ) as name,
			events.type_id,
			events.code,
			events.start_date,
			events.finish_date,
			events.education_org_id,
			events.education_method_id
			from 
				events
			where
				events.id =" + eventID);

		for (ev in eventsArray) {
			basicData = {};
			basicData.name = ev.name + '';
			basicData.selectedType = ev.type_id + '';
			basicData.selectedCode = ev.code + '';
			basicData.startDateTime = StrMimeDate(ev.start_date) + '';
			basicData.finishDateTime = StrMimeDate(ev.finish_date) + '';
			basicData.educationOrgs = DEFAULT_EDUCATION_ORGS;
			basicData.selectedEducationOrgId = ev.education_org_id + '';
			if ( ev.education_method_id.HasValue ) {
				basicData.selectedEducationMethod = {
					id : Int(ev.education_method_id),
					data : {
						name : OpenDoc(UrlFromDocID(ev.education_method_id)).TopElem.name + ''
					}
				}	
			} else {
				basicData.selectedEducationMethod = null
			}		
		}
		basicData.places = getEventPlaces(queryObjects);
		return basicData;
	} else {
		return "Некорректный ID мепроприятия";
	}
}

function getEventCollaborators (queryObjects) {
	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;

	if ( eventID ) {
		var collaboratorArray = [];
		var basicCollaboratorArray = XQuery("sql: select * 
			from 
				event_results 
			where 
				event_results.event_id = " + eventID + " order by event_results.person_fullname asc");
		for (col in basicCollaboratorArray) {
			collaboratorArray.push({
				id : Int(col.person_id),
				fullname : col.person_fullname + '',
				subdivision : col.person_subdivision_name + '',
				position : col.person_position_name + '',
				isAssist : col.is_assist + '' 
			});
		}

		return collaboratorArray;
	} else {
		return "Не корректный ID мепроприятия";
	}
}


function getEventTutors (queryObjects) {
	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;

	try {
		var eventDocTE = OpenDoc(UrlFromDocID(eventID)).TopElem; 
	} catch (e) {
		return "Не корректный ID меропирятия (расположение мероприятия), текст ошибки : " + e;
	}
	var tutorsArray = [];
	var lectorsArray = [];

	for (tutor in ArraySort(eventDocTE.tutors, 'person_fullname', '+')) {
		tutorsArray.push({
			id : Int(tutor.collaborator_id),
			fullname : tutor.person_fullname + '', 
			subdivision : tutor.person_subdivision_name + '', 
			position : tutor.person_position_name + '',
			main : tutor.main + ''
		})
	}

	for (lector in XQuery("sql: select 
			event_lectors.lector_fullname, 
			event_lectors.type, 
			event_lectors.lector_id, 
			event_lectors.person_id 
		from 
			event_lectors 
		where 
			event_lectors.event_id = "+eventID+"
		order by event_lectors.lector_fullname asc")) {
		if (lector.type == 'collaborator') {
			curPersonCard = OpenDoc(UrlFromDocID(lector.person_id)).TopElem;
			lectorsArray.push({
				id : Int(lector.lector_id),
				lastName : curPersonCard.lastname + '',
				firstName : curPersonCard.firstname + '',
				middleName : curPersonCard.middlename + '',
				type : lector.type + '' 
			}) 	 
		} else {
			curPersonCard = OpenDoc(UrlFromDocID(lector.lector_id)).TopElem;
			lectorsArray.push({
				id : Int(lector.lector_id),
				lastName : curPersonCard.lastname + '',
				firstName : curPersonCard.firstname + '',
				middleName : curPersonCard.middlename + '',
				type : curPersonCard.type + '' 
			}) 	 
		}
	}

	return {
		tutors : tutorsArray,
		lectors : lectorsArray
	}
}

function stringifyWT(obj) {
	var type = DataType(obj);
	var curObj = obj;
	var outStr = '';

	if (obj == null || obj == undefined) 
		return 'null';
	if (type == 'string' || type == 'integer')
		return '\"' + obj + '\"'  
	if (type == 'bool')
		return obj;

	if (IsArray(obj)) {
		var temp = '';
		for (prop in obj) {
			temp += stringifyWT(prop) + ',';
		}
		temp = temp.substr(0, temp.length - 1);
		outStr += '[' + temp +']';
	}
	else {
		var temp = '';
		for (prop in obj) {
			temp += '"' + prop + '":' + stringifyWT(obj[prop]) + ',';
		}
		temp = temp.substr(0, temp.length - 1);
		outStr +='{' + temp + '}';
	}
	return outStr;
}

function getEventEditData (queryObjects) {
	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;
	if (ArrayCount(XQuery("sql: select * from events where events.id =" + eventID)) > 0) {
		Session['eventId'] = eventID;
		Session['eventName'] = ArrayOptFirstElem(XQuery("sql: select events.name from events where events.id =" + eventID)).name
		return stringifyWT({
			id: eventID,
			base : getEventBaseData(queryObjects),
			requests : getEventRequests(queryObjects),
			collaborators : getEventCollaborators(queryObjects),
			tutors : getEventTutors(queryObjects),
			testing : getEventTests(queryObjects),
			courses : getEventCourses(queryObjects),
			files : getEventFiles(queryObjects)
		}, 'json');
	} else {
		return "Такого мероприятия не существует, пожалуйста обратитесь в техническую поддержку учебного портала"
	}
}





/* 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------- Сохраняем данные по мероприятию ---------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

function saveNewEvent(queryObjects){
	var eventDoc = OpenNewDoc("x-local://wtv/wtv_event.xmd");
	eventDoc.TopElem.name = 'Пробное';
	eventDoc.TopElem.code = 'ASSESSMENT';
	eventDoc.TopElem.start_date = Date();
	eventDoc.TopElem.finish_date = Date();
	eventDoc.BindToDb();
	eventDoc.Save();
	return tools.object_to_text({
		id: eventDoc.DocID,
		error: null
	}, 'json');
}

function saveData(queryObjects) {
	var data = tools.read_object(queryObjects.Body);

	var curEventCard = OpenDoc(UrlFromDocID(Session.eventId));
	


/* 
-------------------------------------------------------Основные данные  ----------------------------------------------------------------------------------------------------------
*/
	if ( data.HasProperty('base') ) {
		var baseData = data.base;

		/*Название мероприятия*/
		if ( baseData.HasProperty('name') && baseData.name != '' ) {
			if (baseData.name != curEventCard.TopElem.name ) {
				curEventCard.TopElem.name = baseData.name;
			}
		} else {
			return "Название не может быть пустым";
		}

		/*Тип мероприятия*/
		if ( baseData.HasProperty('selectedType') && baseData.selectedType != '' ) {
			if (baseData.selectedType != curEventCard.TopElem.type_id ) {
				curEventCard.TopElem.type_id = baseData.selectedType;
			}
		} else {
			return "Отсутсвует тип мероприятия";	
		}
		
		/*Код мероприятия*/
		if ( baseData.HasProperty('selectedCode') && baseData.selectedCode != '' ) {
			if (baseData.selectedCode != curEventCard.TopElem.code ) {
				curEventCard.TopElem.code = baseData.selectedCode;
			}
		} else {	
			return "Код не может быть пустым";
		}

		/*Расположение мероприятия*/
		if ( baseData.HasProperty('places') ) {
			if ( baseData.places.HasProperty('selectedNode') &&  baseData.places.selectedNode != null ) {
				if (baseData.places.selectedNode.id != curEventCard.TopElem.place_id ) {
				curEventCard.TopElem.place_id = baseData.places.selectedNode.id;
				}
			}	else {
			return "Расположение отсутсвует";
			}	
		} 

		/*Обучающая организация*/
		if ( baseData.HasProperty('selectedEducationOrgId') && baseData.selectedEducationOrgId != null) {
			if (baseData.selectedEducationOrgId != curEventCard.TopElem.education_org_id ) {
				curEventCard.TopElem.education_org_id = baseData.selectedEducationOrgId;
			}		
		} else {
			return "Отсутсвует обучающая органищация";
		}

		/*Учебная программа*/
		if ( baseData.HasProperty('selectedEducationMethod') && baseData.selectedEducationMethod != null ) {
			if ( baseData.selectedEducationMethod.HasProperty('id') ) {
				if (baseData.selectedEducationMethod.id != curEventCard.TopElem.education_method_id ) {
					curEventCard.TopElem.education_method_id = baseData.selectedEducationMethod.id;
				}
			} else {
				return "Некорректный ID в учебной программе";
			}		
		} else {
			return "Отсутсвует учебная программа";
		}

		/*Дата начала и завершения*/
		if ( baseData.HasProperty('startDateTime') && baseData.HasProperty('finishDateTime') ) {
			curEventCard.TopElem.start_date = Date(baseData.startDateTime);
			curEventCard.TopElem.finish_date = Date(baseData.finishDateTime);
		} else {
			return "Выберите дату начала и завершения";
		}

	curEventCard.Save();
	}

	function saveTutorsData(data) {

		function _isColabExist2(files, fileId) {
			for (f in files){
				if ( Int(f.id) == Int(fileId) ) {
					return true;
				}
			}
			return false;
		}
		
		function _isColabExist(files, fileId) {
			for (f in files){
				if ( f.collaborator_id == Int(fileId) ) {
					return true;
				}
			}
			return false;
		}

		function _isLectorExist(files, fileId) {
			for (f in files){
				if ( f.lector_id == Int(fileId) ) {
					return true;
				}
			}
			return false;
		}

		function _refreshTutors (baseTutors, newTutros) {
			var arr = [];
			for (var c = 0; c < ArrayCount(baseTutors); c++ ) {
				if ( !_isColabExist2( newTutros, baseTutors[c].collaborator_id ) ) {
					arr.push(baseTutors[c]);
				}
			}
			for (var i = arr.length - 1; i >= 0; i--) {
				arr[i].Delete();
			}
		}

		function _refreshLectors (baseLectors, newLectors) {
			var arr = [];
			for (var c = 0; c < ArrayCount(baseLectors); c++ ) {
				if ( !_isColabExist2( newLectors, baseLectors[c].lector_id ) ) {
					arr.push(baseLectors[c]);
				}
			}
			for (var i = arr.length - 1; i >= 0; i--) {
				arr[i].Delete();
			}
		}
		function _isNew (id) {
			return ( ArrayCount(XQuery("for $elem in lectors where $elem/id = "+id+" return $elem")) == 0 )
		}

		// Данные с клиента
		var newLectorsArray = data.lectors;
		var newTutorsArray = data.tutors;


		// Обновление массивов, если было удаление на клиенте, убираем в карточке
		_refreshTutors(curEventCard.TopElem.tutors, newTutorsArray);
		_refreshLectors(curEventCard.TopElem.lectors, newLectorsArray);
		curEventCard.Save();


		for (tutor in newTutorsArray) {
			if ( !_isColabExist(curEventCard.TopElem.tutors, tutor.id) ) {
				newTutor = curEventCard.TopElem.tutors.ObtainChildByKey( Int(tutor.id) );
				newTutor.main = tutor.main;
				tools.common_filling( 'collaborator', newTutor, Int(tutor.id) );
				curEventCard.Save();
			} else {
				newTutor = curEventCard.TopElem.tutors.ObtainChildByKey( Int(tutor.id) );
				newTutor.main = tutor.main;
				curEventCard.Save();
			}
		}

		for (lector in newLectorsArray) {
			if ( _isNew(lector.id) ) {
			doc = tools.new_doc_by_name('lector')
				if (lector.type == 'collaborator') {
					doc.TopElem.type = 'collaborator';
					doc.TopElem.person_id = Int(lector.id);
				} else {
					doc.TopElem.type = 'invitee';
					doc.TopElem.lastname = lector.lastName
					doc.TopElem.middlename = lector.middleName
					doc.TopElem.firstname = lector.firstName
					doc.TopElem.email = lector.email
					doc.TopElem.comment = lector.company;
				}
				doc.BindToDb(DefaultDb);
				doc.Save();
				newLector = curEventCard.TopElem.lectors.ObtainChildByKey( Int(doc.DocID) );
				curEventCard.Save();	
			} else {
				if ( !_isLectorExist(curEventCard.TopElem.lectors, Int(lector.id)) ) {
					newLector = curEventCard.TopElem.lectors.ObtainChildByKey( Int(lector.id) );
					curEventCard.Save();
				}
			}
		}
	}

	function saveCollaboratorsData(data) {

		function _isColabExist2(files, fileId) {
			for (f in files){
				if ( Int(f.id) == Int(fileId) ) {
					return true;
				}
			}
			return false;
		}
		
		function _isColabExist(files, fileId) {
			for (f in files){
				if ( f.collaborator_id == Int(fileId) ) {
					return true;
				}
			}
			return false;
		}

		function _refreshCollaborators (baseCollaborators, newCollaborators) {
			for (c = 0; c < ArrayCount(baseCollaborators); c++ ) {
				if ( !_isColabExist2( newCollaborators, baseCollaborators[c].collaborator_id ) ) {
					tools.del_person_from_event( Int(baseCollaborators[c].collaborator_id), Int(Session.eventId),'', true );
				}
			}
		}

		var defaultCollaboratorArray = data.collaborators;
		_refreshCollaborators(curEventCard.TopElem.collaborators, defaultCollaboratorArray);

		for (colab in defaultCollaboratorArray) {
			if ( _isColabExist(curEventCard.TopElem.collaborators, colab.id) ) {
				eventResultCardID = ArrayOptFirstElem(XQuery("for $elem in event_results where $elem/event_id = "+Session.eventId+" and $elem/person_id = "+colab.id+" return $elem")).id;
				if (eventResultCardID != undefined) {
					eventResultCard = OpenDoc(UrlFromDocID(eventResultCardID));
					eventResultCard.TopElem.is_assist = colab.isAssist;
					eventResultCard.Save();
				}
			} else {
				tools.add_person_to_event( Int(colab.id), Int(Session.eventId), null, curEventCard );
				eventResultCardID = ArrayOptFirstElem(XQuery("for $elem in event_results where $elem/event_id = "+Session.eventId+" and $elem/person_id = "+colab.id+" return $elem")).id;
				if (eventResultCardID != undefined) {
					eventResultCard = OpenDoc(UrlFromDocID(eventResultCardID));
					eventResultCard.TopElem.is_assist = colab.isAssist;
					eventResultCard.Save();
				}
			}
		}
	}

	function saveTestsData(data) {

		function _isTestExist(files, fileId) {
			for (f in files){
				if ( Int(f.id) == Int(fileId) ) {
					return true;
				}
			}
			return false;
		}

		var newTestArray = data.allTests;
		curEventCard.TopElem.prev_testing.Clear();
		curEventCard.TopElem.post_testing.Clear();
		curEventCard.Save();

		if ( ArrayCount(newTestArray) ) {
			for (test in newTestArray) {
				if (test.type == 'prev') {
					curEventCard.TopElem.prev_testing.auto_assign = 'true';
					curEventCard.TopElem.prev_testing.assessments.ObtainChildByKey( Int(test.id));
				} else {
					curEventCard.TopElem.post_testing.assessments.ObtainChildByKey( Int(test.id));
				}
			}
			curEventCard.Save();
		}
	}

	function saveRequestData(data) {
		if (data.isOpen) {
			curEventCard.TopElem.is_open = data.isOpen;
			curEventCard.TopElem.date_request_begin = Date(data.requestBeginDate);
			curEventCard.TopElem.date_request_over = Date(data.requestOverDate);
			curEventCard.TopElem.custom_elems.ObtainChildByKey('func_manager_accept').value = data.isApproveByBoss;
			curEventCard.TopElem.custom_elems.ObtainChildByKey('main_tutor_accept').value = data.isApproveByTutor;
			curEventCard.TopElem.default_request_type_id = 5984338634217761421 // заявка на мероприятие
			curEventCard.Save()
		} else {
			curEventCard.TopElem.is_open = data.isOpen;
			curEventCard.TopElem.date_request_begin = null;
			curEventCard.TopElem.date_request_over = null;
			alert(data.isApproveByBoss);
			alert(data.isApproveByTutor);
			curEventCard.TopElem.custom_elems.ObtainChildByKey('func_manager_accept').value = data.isApproveByBoss;
			curEventCard.TopElem.custom_elems.ObtainChildByKey('main_tutor_accept').value = data.isApproveByTutor;
			curEventCard.TopElem.default_request_type_id = null // пустота
			curEventCard.Save()
		}
	}

	saveCollaboratorsData(data.collaborators);
	saveTutorsData(data.tutors);
	saveTestsData(data.testing);
	saveRequestData(data.requests)
}


%>