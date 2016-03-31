<%



/* 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------- Вспомогательные функции  -----------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

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


function createNotifications (queryObjects) {

	var curPersonCard = OpenDoc(UrlFromDocID(curUserID))
	var recipients = queryObjects.HasProperty('recipients') ? true : false
	var senderAddress = curPersonCard.TopElem.email != '' ? curPersonCard.TopElem.email : 'study@merlion.ru';
	var subject = queryObjects.HasProperty('subject') ? queryObjects.subject : "Новое уведомление"
	var messeageText = queryObjects.HasProperty('messeage_text') ? queryObjects.messeage_text : false
	if ( recipients && messeageText ) {
		for (r in recipients) {
			curResonAddress = OpenDoc(UrlFromDocID(r.id)).TopElem.email
			if (curResonAddress != '') {
				cardDoc = OpenNewDoc("x-local://wtv/wtv_active_notification.xmd");
				cardDoc.TopElem.is_custom='1';
				cardDoc.TopElem.status='active';
				cardDoc.TopElem.sender.address= senderAddress;
				cardDoc.TopElem.subject = subject;
				cardDoc.TopElem.body = messeageText;
				cardDoc.TopElem.body_type="html";
				cardDoc.TopElem.recipients.AddChild("recipient");
				cardDoc.TopElem.recipients[0].address = curResonAddress;
				cardDoc.TopElem.send_date=Date();
				cardDoc.BindToDb();
				cardDoc.Save();
			} 	
		}
	}
}

/* 
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------- Получаем данные по определенному каталогу  -----------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

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
		l.type = (l.type == 'invitee') ? 'Внешний' : 'Внутренний';
		lectorsArray.push({ 
			id: Int(l.id), 
			data: {
				name : l.name + '',
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
			resources.type = 'pdf' ");
	queryPageCount = Int(ArrayOptFirstElem(queryPageCount).pagesCount)

	var basicRecourseArray = XQuery("sql:select 
		top " + limitRows + " r.id, 
		REPLACE(r.name, '\"', '') as name 
		from (
			select ROW_NUMBER() OVER(ORDER BY resources.name) rowNum,* 
			from 
				resources
			where 
				resources.name LIKE '%"+filterText+"%' and
				resources.type = 'pdf' 
		) r
		where 
			r.rowNum > " + startPage * limitRows);

	var resourcesArray = [];
	for (r in basicRecourseArray) {
		resourcesArray.push({ 
			id: Int(r.id), 
			data: {
				name : r.name + ''
			}
		});
	}
	return tools.object_to_text({
		pagesCount: queryPageCount + 1,
		items: resourcesArray,
		headerCols: [
			{'name' : 'Название файла', 'type':'string' }
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
			library_materials.year <> '' ");
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
	return {
		pagesCount: queryPageCount + 1,
		items: libraryMaterialsArray
	}
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




function getEventRequests (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null; 

	if (eventID != null) {
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
		 	requests.type = 'event' and
		 	requests.object_id = " + eventID);
	

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
		return {
			requestItems: requestsArray
		}
	}
}

function getEventTests (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null; 

	if (eventID != null) {
		basicActiveTestsArray = XQuery("sql: select 
			active_test_learnings.id as id,
			active_test_learnings.person_id as personId,
			active_test_learnings.person_fullname as personFIO, 
			active_test_learnings.assessment_name as assessment_name,
			active_test_learnings.state_id as status,
			active_test_learnings.score as score
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
			test_learnings.state_id as status,
			test_learnings.score as score
		from
			test_learnings
		where
			test_learnings.event_id =" + eventID);
	

		var requestsArray = [];
		for (at in basicActiveTestsArray) {
			requestsArray.push({ 
				id: Int(at.id), 
				data: {
					name : at.personFIO + '',
					assessment_name: at.assessment_name + '',
					status: at.status + '',
					score: at.score + ''
				}
			});
		}
		return {
			items: requestsArray
		}
	}
}

function getEventCourses (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null; 

	if (eventID != null) {
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
			learnings.event_id =" + eventID);
	

		var requestsArray = [];
		for (ac in basicActiveCoursesArray) {
			requestsArray.push({ 
				id: Int(ac.id), 
				data: {
					name : ac.personFIO + '',
					assessment_name: ac.assessment_name + '',
					status: ac.status + '',
					score: ac.score + ''
				}
			});
		}
		return {
			items: requestsArray
		}
	}
}

function getEventFiles (queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null; 

	if (eventID != null) {
		var filesArray = [];
		var basicFilesArray = OpenDoc(UrlFromDocID(eventID)).TopElem.files;
		for (f in basicFilesArray) {
			curFile = OpenDoc(UrlFromDocID(f.file_id)).TopElem;
			filesArray.push({
				id: Int(f.file_id),
				data: {
					name : curFile.name + '',
					type : curFile.type + '',
					download : curFile.allow_download + '',
					view : curFile.allow_unauthorized_download + '' // будем использовать для отображения
				}
			});
		}

		return {
			items: filesArray
		}
	}
}

function getEventPlaces(queryObjects) {

	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;
	var eventIDTE = OpenDoc(UrlFromDocID(Int(eventID))).TopElem;

	if (eventID != null) {
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
	return {
		selectedNode: { 
			id : eventIDTE.place_id + '', 
			name : OpenDoc(UrlFromDocID(Int(eventIDTE.place_id))).TopElem.name + ''
		},
		nodes: tree
	};
}

function getEventBaseData (queryObjects) {
	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;
	var eventDocTE = OpenDoc(UrlFromDocID(Int(eventID))).TopElem; 

	var basicData = {
		name : eventDocTE.name + '',
		selectedType : eventDocTE.type_id + '',
		selectedCode : eventDocTE.code + '',
		startDateTime : StrMimeDate(eventDocTE.start_date) + '',
		finishDateTime : StrMimeDate(eventDocTE.finish_date) + '',
		educationOrgs : [{ id: '5919417932074195731', name : 'Учебный центр MERLION'}, { id: '5929396429688827825', name : 'ОоИР'}],
		selectedEducationOrgId : Int(eventDocTE.education_org_id),
		selectedEducationMethod : {
			id : Int(eventDocTE.education_method_id),
			data : {
				name : OpenDoc(UrlFromDocID(Int(eventDocTE.education_method_id))).TopElem.name + ''
			}	
		},
		places : getEventPlaces(queryObjects) 
	}
	return basicData
}

function getEventCollaborators (queryObjects) {
	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;

	if (eventID != null) {
		var collaboratorArray = [];
		var basicCollaboratorArray = XQuery("sql: select * 
			from 
				event_results 
			where 
				event_results.event_id = " + eventID);
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
	}
}

function getEventTutors (queryObjects) {
	var eventID = queryObjects.HasProperty('event_id') ? Int(queryObjects.event_id) : null;

	if (eventID != null) {
		var eventDocTE = OpenDoc(UrlFromDocID(Int(eventID))).TopElem; 

		var tutorsArray = [];
		var lectorsArray = [];

		for (tutor in eventDocTE.tutors) {
			tutorsArray.push({
				id : Int(tutor.collaborator_id),
				data : {
					fullname : tutor.person_fullname + '', 
					subdivision : tutor.person_subdivision_name + '', 
					position : tutor.person_position_name + '',
					main : tutor.main
				} 	 
			})
		}

		for (lector in XQuery("sql: select event_lectors.lector_fullname, event_lectors.type, event_lectors.person_id from event_lectors where event_lectors.event_id = " + eventID )) {
			lector_type = lector.type == 'collaborator' ? 'внутренний' : 'внешний';
			lectorsArray.push({
				id : Int(lector.person_id),
				data : {
					fullname : lector.lector_fullname + '', 
					type : lector_type + '' 
				} 	 
			})
		}

		return {
			tutors : tutorsArray,
			lectors : lectorsArray
		}
	}
}

function getEventEditData (queryObjects) {
	return tools.object_to_text({
		base : getEventBaseData(queryObjects),
		requests : getEventRequests(queryObjects),
		collaborators : getEventCollaborators(queryObjects),
		tutors : getEventTutors(queryObjects),
		testing : getEventTests(queryObjects),
		courses : getEventCourses(queryObjects),
		library_materials : null,
		files : getEventFiles(queryObjects)
	}, 'json');
}

%>