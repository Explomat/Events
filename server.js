<%
	function getObjectValues(obj){
		var values = [];
		for (o in obj){
			values.push(obj[o]);
		}
		return values;
	}

	var actionsDenied = {
		createRequest: 'createRequest',
		removeCollaborator: 'removeCollaborator'
	}

	var componentsDenied = {
		BusinessTypeFilter: 'BusinessTypeFilter',
		RegionsFilter: 'RegionsFilter'
	}

	var groups = [
		{
			name: 'event_admin',
			actionsDenied: [],
			componentsDenied: [],
			priority: 0
		},

		{
			name: 'event_training',
			actionsDenied: [],
			componentsDenied: [],
			priority: 1
		},

		{
			name: 'event_user',
			actionsDenied: [],
			componentsDenied: [],
			priority: 2
		},

		{
			name: 'event_all',
			actionsDenied: getObjectValues(actionsDenied),
			componentsDenied: getObjectValues(componentsDenied),
			priority: 3
		}
	]

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

	//Работа с группами ----------------------------------------------------------------------------------------------
	function getGroupByName(groupName){
		for (var i = groups.length - 1; i >= 0; i--) {
			if (groups[i].name == groupName) return groups[i];
		};
	}

	function getGroupByMaxPriority(_groups){
		if (!IsArray(_groups) || _groups.length == 0) return null;

		var min = _groups[_groups.length - 1].priority;
		var index = _groups.length - 1;
		for (var i = _groups.length - 1; i >= 0; i--) {
			if (min < _groups[i].priority) {
				min = _groups[i].priority;
				index = i;
			}
		};
		return groups[index];
	}

	function getUserGroups(userId){
		return ArraySelectAll(XQuery("sql:select g.data.value('(group/code)[1]','varchar(50)') as name
							from [group] g
							inner join groups on groups.id=g.id
							cross apply g.data.nodes('/group/collaborators/collaborator/collaborator_id') T(C)
							where T.C.value('.', 'varchar(50)')=" + userId));
	}

	function getMatchedUserGroups(userId){
		var userGroups = getUserGroups(userId);
		var matchedGroups = [];
		var i = userGroups.length - 1;
		var j = groups.length - 1;
		for (i; i >= 0; i--) {
			for (j; j >= 0; j--) {
				if (groups[j].name == userGroups[i].name) {
					matchedGroups.push(groups[j]);
				}
			};
		};
		return matchedGroups;
	}
	//------------------------------------------------------------------------------------------------------------------------------------------

	function getLastDate (year, month) {
		if (month == 12) {
			var myDate = Date("1.01."+ (year + 1));
		} else {
			var myDate = Date("1."+(month + 1)+"."+year);
		}  
		return DateNewTime(RawSecondsToDate(Int(DateToRawSeconds(myDate)) - 1));
	}

	

	function getEventInfo (queryObjects) {
		function _isEventExist(eventId){
			var curEventID = null;
			try { curEventID = Int(eventId); }
			catch(e) { return false; }
			return ArraySelectAll(XQuery("sql: select events.id from events where events.id=" +curEventID)).length > 0;
		}
		
		if (!_isEventExist(queryObjects.event_id)) {
			return 'Данного мероприятия не существует!';
		}

		var curEventID = Int(queryObjects.event_id);
		var curEventCard = OpenDoc(UrlFromDocID(curEventID));
		var reportHref = '/view_doc.html?mode=response&response_object_id='+curEventID+'&response_type_code=response_event';
		var webinarEnterHref = '/vclass/webinar.html?room='+curEventID+'&code='+curUserID;
		if (curEventCard.TopElem.place_id.HasValue && curEventCard.TopElem.place_id != 6106768546989817488 ) {
			var placeCard = OpenDoc(UrlFromDocID(curEventCard.TopElem.place_id));
			var eventPlace = OpenDoc(UrlFromDocID(placeCard.TopElem.region_id)).TopElem.name;
			var eventAddress = placeCard.TopElem.address.HasValue == true ? placeCard.TopElem.address : '';
		} else {
			var eventPlace = '';
			var eventAddress = '';
		}
		if (curEventCard.TopElem.type_id)

		var eventType = curEventCard.TopElem.type_id == 'webinar' ? 'webinar' : 'full_time';
		if (eventType == 'webinar' && curEventCard.TopElem.show_record &&  curEventCard.TopElem.record.recorder_id != null) {
			var webinarDownloadInfo = {
					id : Int(curEventCard.TopElem.record.recorder_id),
					href : '/vclass/vcplayer.html?cid=' + curEventID +'&download=1',
					name : 'Запись вебинара',
					type : 'webinar_record',
					isDownload : curEventCard.TopElem.allow_record_download + ''	
			};
			var webinarInfo = {
					id : Int(curEventCard.TopElem.record.recorder_id),
					href : '/vclass/vcplayer.html?cid=' + curEventID,
					enterHref: webinarEnterHref	
			};
		} else {
			var webinarDownloadInfo = null;
			var webinarInfo = {
				id: null,
				href: null,
				enterHref: webinarEnterHref
			};
		}
		var collaboratorsArray = [];
		if (ArrayCount(curEventCard.TopElem.collaborators) > 0 ) {
			for (col in curEventCard.TopElem.collaborators) {
				collaboratorsArray.push({
					id : Int(col.collaborator_id), 
					fullname : col.person_fullname + '',
					href : '/view_doc.html?mode=collaborator&object_id=' + Int(col.collaborator_id)
				});
			}
		}

		var tutorsArray = [];
		if (ArrayCount(curEventCard.TopElem.tutors) > 0 ) {
			for (tutor in curEventCard.TopElem.tutors) {
				tutorCard = OpenDoc(UrlFromDocID(Int(tutor.collaborator_id)))
				tutorPhoneNumber = tutorCard.TopElem.phone != '' ? tutorCard.TopElem.phone : 'отсутсвует';
				tutorMail = tutorCard.TopElem.email != '' ? tutorCard.TopElem.email : "отсутсвует";
				tutorsArray.push({
					id : Int(tutor.collaborator_id),
					fullname : tutor.person_fullname + '',
					email : tutorMail + '',
					phone : tutorPhoneNumber + '',
					href : '/view_doc.html?mode=collaborator&object_id=' + Int(tutor.collaborator_id)
				});
			}
		}

		var lectorsArray = [];
		if (ArrayCount(curEventCard.TopElem.lectors) > 0 ) {
			for (lector in curEventCard.TopElem.lectors) {
				lectorCard = OpenDoc(UrlFromDocID(Int(lector.lector_id)))
				if (lectorCard.TopElem.type == 'collaborator') {
					lectorData = OpenDoc(UrlFromDocID(Int(lectorCard.TopElem.person_id)));
					lectorPhoneNumber = lectorData.TopElem.phone != '' ? lectorData.TopElem.phone : "отсутсвует";
					lectorMail = lectorData.TopElem.email != '' ? lectorData.TopElem.email : "отсутсвует";

					lectorsArray.push({
						id : Int(lectorCard.TopElem.person_id),
						fullname : lectorCard.TopElem.person_fullname + '',
						email : lectorMail + '',
						phone : lectorPhoneNumber + '',
						href : '/view_doc.html?mode=collaborator&object_id=' + Int(lectorCard.TopElem.person_id)
					});
				} else {
					lectorPhoneNumber = lectorCard.TopElem.phone != '' ? lectorData.TopElem.phone : "отсутсвует";
					lectorMail = lectorCard.TopElem.email != '' ? lectorData.TopElem.email : "отсутсвует";
					lectorsArray.push({
						id : Int(lector.lector_id),
						fullname : lectorCard.TopElem.lastname + lectorCard.TopElem.firstname + lectorCard.TopElem.middlename + '',
						email : lectorMail + '',
						phone : lectorPhoneNumber + '',
						href : '/view_doc.html?mode=lector&object_id=' + Int(lector.lector_id)
					});
				}
			}
		}

		var filesArray = [];
		for (file in curEventCard.TopElem.files) {
			fileCard = OpenDoc(UrlFromDocID(Int(file.file_id)));
			filesArray.push({
				id : Int(file.file_id),
				href : '/download_file.html?file_id=' + Int(file.file_id),
				name : StrReplace(fileCard.TopElem.name, '\"', '\''),
				type : fileCard.TopElem.type + '',
				isDownload : fileCard.TopElem.allow_download + ''
			});
		}
		if (eventType == 'webinar' && curEventCard.TopElem.show_record) {
			filesArray.push(webinarDownloadInfo);
		}	


		return stringifyWT({
			id: curEventID, 
			name: StrReplace(curEventCard.TopElem.name, '\"', '\''),
			startDate: StrMimeDate(curEventCard.TopElem.start_date),
			finishDate: StrMimeDate(curEventCard.TopElem.finish_date),
			status: curEventCard.TopElem.status_id + '',
			place: eventPlace + ', ' + eventAddress + '',
			type: eventType + '',
			collaborators: ArraySort(collaboratorsArray, 'fullname','+'),
			tutors: tutorsArray,
			lectors: lectorsArray,
			files: filesArray,
			webinarInfo: webinarInfo,
			reportHref: reportHref
		});
	}

	function getEvents(queryObjects) {

		var curPersonCard = OpenDoc(UrlFromDocID(curUserID))
		var curUser = curPersonCard.TopElem;
		var selectedYear = Int(queryObjects.year);
		var selectedMonth = Int(queryObjects.month);
		var region = queryObjects.HasProperty('region') ? queryObjects.region : curUser.custom_elems.ObtainChildByKey('office_code').value;
		if (queryObjects.HasProperty('business_type')) {
			var personBusinessType = queryObjects.business_type
		} else {
			var personBusinessType = curPersonCard.TopElem.custom_elems.ObtainChildByKey('id_business_list').value == 'CL' ? 
		'CITILINK' : curPersonCard.TopElem.custom_elems.ObtainChildByKey('id_business_list').value == 'MERLION' ? 'MERLION' : 'CITILINK';
		}
		if (personBusinessType == 'ALL') {
			personBusinessType = '';
		}
		var firstDate = StrXmlDate(Date("1."+selectedMonth+"."+selectedYear));
		var lastDate = StrXmlDate(getLastDate(selectedYear, selectedMonth));


		var getEventArray = XQuery("sql: 
			select ec.event_id as id,
					REPLACE(ec.name, '\"', '''') as name,
					ec.type_id as type,
					ec.start_date as startDate,
					ec.finish_date as finishDate,
					ec.status_id as status,
					evs.place_id as place_id
			from event_collaborators as ec 
		    inner join events evs on ec.event_id=evs.id 
			where ec.collaborator_id = '"+curUserID+"' and
				(ec.start_date < '"+lastDate+"' and
				ec.start_date >= '"+firstDate+"') and
				ec.status_id <> 'cancel'

			UNION 
			select events.id as id, 
					REPLACE(events.name, '\"', '''') as name,
					events.type_id as type,
					events.start_date as startDate,
					events.finish_date as finishDate,
					events.status_id as status,
					events.place_id as place_id
				from events 
				where events.is_public = 'true' and
					events.code LIKE '%"+personBusinessType+"%' and 
					(events.start_date < '"+lastDate+"' and
					events.start_date >= '"+firstDate+"') and
					events.status_id <> 'cancel'
			");

		var userGroup = getGroupByMaxPriority(getMatchedUserGroups(curUserID));

		var eventsArray = [];
		for (e in getEventArray) {
			e.type = e.type == 'webinar' ? 'webinar' : 'full_time';
			if (OpenDoc(UrlFromDocID(e.id)).TopElem.place_id == 6106768546989817488) {
				eventPlace = 'Вебинар';
			} else {
				eventPlace = OpenDoc(UrlFromDocID(e.id)).TopElem.place_id.ForeignElem.region_id.ForeignElem.name;
			}
			eventsArray.push({
				id: Int(e.id), 
				name: e.name + '', 
				type: e.type + '', 
				startDate: StrMimeDate(e.startDate),
				finishDate: StrMimeDate(e.finishDate),
				status: e.status + '',
				place: eventPlace + '',
				place_id: e.place_id 
			});
		}
		if (userGroup == null ) {
			var xarrPlacesIds = [];
			if(curUser.position_parent_id.HasValue && curUser.position_parent_id.ForeignElem != undefined)
			{
				iParentId = curUser.position_parent_id;
				do
				{
					teSub = OpenDoc(UrlFromDocID( iParentId )).TopElem;
					if(teSub.place_id.HasValue)
						xarrPlacesIds.push(teSub.place_id);
					iParentId = teSub.parent_object_id;
				}
				while( teSub.parent_object_id.HasValue && teSub.parent_object_id.ForeignElem != undefined )			
			}
			eventsArray = ArraySelect(eventsArray, "This.place_id.HasValue && ArrayOptFind(xarrPlacesIds, 'This == ' + This.place_id) != undefined");
		} else {
			if (region != "Все регионы") {
				var xarrPlacesIds = [];
				var findRegionID = ArrayOptFirstElem(XQuery("sql: select * from regions where regions.name = '"+ region+"'")).id
				var regionsArray = XQuery("sql: select places.id from places where places.region_id ="+findRegionID);
				for (teSub in regionsArray) {
					xarrPlacesIds.push(teSub.id);
				}
				eventsArray = ArraySelect(eventsArray, "This.place_id.HasValue && ArrayOptFind(xarrPlacesIds, 'This == ' + This.place_id) != undefined");
			}
			
		}

		return eventsArray;
	}
 
	function getEventsData(queryObjects) {
		return stringifyWT(getEvents(queryObjects));
	}

	function getData(queryObjects){
		var currentDate = Date();
		var currentYear = Year(currentDate);
		var currentMonth = Month(currentDate);
		var curPersonCard = OpenDoc(UrlFromDocID(curUserID));
		var personBusinessType = curPersonCard.TopElem.custom_elems.ObtainChildByKey('id_business_list').value == 'CL' ? 
		'CITILINK' : curPersonCard.TopElem.custom_elems.ObtainChildByKey('id_business_list').value == 'MERLION' ? 'MERLION' : 'CITILINK';
		var userGroup = getGroupByMaxPriority(getMatchedUserGroups(curUserID));
		userGroup = userGroup == null ? getGroupByName('event_all') : userGroup;

		var regionsArray = ['Все регионы'];
		for (reg in ArraySort(XQuery("sql: select regions.name from regions"),'name','+')) {
			regionsArray.push(reg.name + '');
		}

		return stringifyWT({
			user: {
				id: curUserID,
				componentsDenied: userGroup.componentsDenied,
				actionsDenied: userGroup.actionsDenied,
				businessType: personBusinessType,
				region: curPersonCard.TopElem.custom_elems.ObtainChildByKey('office_code').value + ''
			},
			currentDate: StrMimeDate(currentDate),
			events: getEvents({year: currentYear, month: currentMonth}),
			regions: regionsArray
		});
	}

	function createRequest(queryObjects) {
		var curEventCard = Int(queryObjects.event_id); // ID мероприятия
		var repeatRequests = XQuery("sql: select req.id from requests as req where req.status_id = 'active' and req.person_id="+curUserID+" and req.object_id = "+curEventCard)
		alert("кол-во" + ArrayCount(repeatRequests))
		if (ArrayCount(repeatRequests) == 0 ) {
			var curUserCard = OpenDoc(UrlFromDocID(curUserID)); // Сотруник подавший заявку
			var requestTypeId = Int(5984338634217761421); // id заявки на мероприятие
			var curEventCardTE = OpenDoc(UrlFromDocID(curEventCard)).TopElem; // TopElem карточки мероприятия
			var curUserCardTE = OpenDoc(UrlFromDocID(curUserID)).TopElem; // TopElem карточки сотруника
			var requestTypeTE = OpenDoc(UrlFromDocID(requestTypeId)).TopElem; //TopElem карточки заяки
			try {
				var new_request_doc = OpenNewDoc("x-local://wtv/wtv_request.xmd");
				new_request_doc.TopElem.object_id = curEventCard;
				new_request_doc.TopElem.person_id = curUserID;
				tools.common_filling( 'request_type', new_request_doc.TopElem, requestTypeId, requestTypeTE );
				tools.common_filling( 'collaborator', new_request_doc.TopElem, curUserID, curUserCardTE );
				tools.object_filling( new_request_doc.TopElem.type, new_request_doc.TopElem, curEventCard, curEventCardTE );
				new_request_doc.BindToDb(); 
				new_request_doc.Save();
			} catch(e) {
				return e;
			}
		} else {
			return 'Вы уже подавали заявку на данное мероприятия, для её подтверждения обратитесь к ответственному за мероприятие';
		}
	}

	function removeCollaborator(queryObjects) {
		var curEventCard = Int(queryObjects.event_id); // ID мероприятия
		var curEventCardTE = OpenDoc(UrlFromDocID(curEventCard));
		try { 
			tools.del_person_from_event( curUserID, curEventCard, curEventCardTE, true );
		} catch (e) {
			return e;
		}
	}

	function startEvent(queryObjects) {
		try {
			tools.event_start(queryObjects.event_id)
		} catch (e) {
			return e;
		}
	}


	function finishEvent(queryObjects) {
		try {
			tools.event_finish(queryObjects.event_id)
		} catch (e) {
			return e;
		}
	}

%>