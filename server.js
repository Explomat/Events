<%
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

	function getLastDate (year, month) {
		if (month == 12) {
			var myDate = Date("1.01."+ (year + 1));
		} else {
			var myDate = Date("1."+(month + 1)+"."+year);
		}  
		return DateNewTime(RawSecondsToDate(Int(DateToRawSeconds(myDate)) - 1));
	}

	function getEventInfo (queryObjects) {
		var curEventID = Int(queryObjects.id);
		var curEventCard = OpenDoc(UrlFromDocID(curEventID));
		if (curEventCard.TopElem.place_id.HasValue && curEventCard.TopElem.place_id != 6106768546989817488 ) {
			var placeCard = OpenDoc(UrlFromDocID(curEventCard.TopElem.place_id));
			var eventPlace = OpenDoc(UrlFromDocID(placeCard.TopElem.region_id)).TopElem.name;
			var eventAddress = placeCard.TopElem.address.HasValue == true ? placeCard.TopElem.address : '';
		} else {
			var eventPlace = '';
			var eventAddress = '';
		}
		
		var eventType = curEventCard.TopElem.type_id == 'webinar' ? 'webinar' : 'full_time';

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
				tutorPhoneNumber = tutorCard.TopElem.phone != '' ? tutorCard.TopElem.phone : '----';
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
					lectorPhoneNumber = lectorData.TopElem.phone != '' ? lectorData.TopElem.phone : "----";
					lectorMail = lectorData.TopElem.email != '' ? lectorData.TopElem.email : "отсутсвует";

					lectorsArray.push({
						id : Int(lector.lector_id),
						fullname : lectorCard.TopElem.person_fullname + '',
						email : lectorMail + '',
						phone : lectorPhoneNumber + '',
						href : '/view_doc.html?mode=collaborator&object_id=' + Int(lector.lector_id)
					});
				} else {
					lectorPhoneNumber = lectorCard.TopElem.phone != '' ? lectorData.TopElem.phone : "----";
					lectorMail = lectorCard.TopElem.email != '' ? lectorData.TopElem.email : "отсутсвует";
					lectorsArray.push({
						id : Int(lector.lector_id),
						fullname : lectorCard.TopElem.lastname + lectorCard.TopElem.firstname + lectorCard.TopElem.middlename + '',
						email : lectorMail + '',
						phone : lectorPhoneNumber + '',
						href : '/view_doc.html?mode=collaborator&object_id=' + Int(lector.lector_id)
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


		return stringifyWT({
			id: curEventID,	 
			name: StrReplace(curEventCard.TopElem.name, '\"', '\''),
			startDate: StrMimeDate(curEventCard.TopElem.start_date),
			finishDate: StrMimeDate(curEventCard.TopElem.finish_date),
			status: curEventCard.TopElem.status_id + '',
			place: eventPlace + ', ' + eventAddress + '',
			type: eventType + '',
			collaborators: collaboratorsArray, 
			tutors: tutorsArray,
			lectors: lectorsArray,
			files: filesArray
		});
	}

	function getEvents(queryObjects) {
		var curPersonCard = OpenDoc(UrlFromDocID(curUserID))
		var selectedYear = Int(queryObjects.year);
		var selectedMonth = Int(queryObjects.month);
		var personBusinessType = curPersonCard.TopElem.custom_elems.ObtainChildByKey('id_business_list').value == 'CL' ? 
		'CITILINK' : curPersonCard.TopElem.custom_elems.ObtainChildByKey('id_business_list').value == 'MERLION' ? 'MERLION' : 'CITILINK' 
		var firstDate = StrXmlDate(Date("1."+selectedMonth+"."+selectedYear));
		var lastDate = StrXmlDate(getLastDate(selectedYear, selectedMonth));


		/*var getEventArray = XQuery("sql: 
			select events.id as id, 
			REPLACE(events.name, '\"', '') as name,
			events.type_id as type,
			events.start_date as startDate,
			events.finish_date as finishDate,
			events.status_id as status
			from events where
			events.code = 'CITILINK' 
			(events.start_date < '"+lastDate+"' and
			events.start_date >= '"+firstDate+"') and
			events.status_id <> 'cancel'
			");*/
		var getEventArray = XQuery("sql: 
			select ec.event_id as id,
					REPLACE(ec.name, '\"', '''') as name,
					ec.code as code,
					ec.type_id as type,
					ec.start_date as startDate,
					ec.finish_date as finishDate,
					ec.status_id as status
			from event_collaborators as ec 
			where ec.collaborator_id = '"+curUserID+"' and
				(ec.start_date < '"+lastDate+"' and
				ec.start_date >= '"+firstDate+"') and
				ec.status_id <> 'cancel'
			UNION 
			select events.id as id, 
					REPLACE(events.name, '\"', '''') as name,
					events.code as code,
					events.type_id as type,
					events.start_date as startDate,
					events.finish_date as finishDate,
					events.status_id as status
				from events 
				where events.is_public = 'true' and
					events.code = '"+personBusinessType+"' and 
					(events.start_date < '"+lastDate+"' and
					events.start_date >= '"+firstDate+"') and
					events.status_id <> 'cancel'
			");

		var eventsArray = [];
		for (e in getEventArray) {
			e.type = e.type == 'webinar' ? 'webinar' : 'full_time';
			if (OpenDoc(UrlFromDocID(e.id)).TopElem.place_id == 6106768546989817488) {
				eventPlace = 'Глобальная паутина';
			} else {
				eventPlace = OpenDoc(UrlFromDocID(e.id)).TopElem.place_id.ForeignElem.region_id.ForeignElem.name;
			}
			eventsArray.push({ id: Int(e.id), name: e.name + '', type: e.type + '', startDate: StrMimeDate(e.startDate), finishDate: StrMimeDate(e.finishDate), status: e.status + '', place: eventPlace + '' });
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
		return stringifyWT({
			currentDate: StrMimeDate(currentDate),
			events: getEvents({year: currentYear, month: currentMonth})
		});
	}

	function createRequest(queryObjects) {
		var curEventCard = Int(queryObjects.eventId); // ID мероприятия
		var curUserCard = OpenDoc(UrlFromDocID(curUserID)); // Сотруник подавший заявку
		var requestTypeId = Int(5984338634217761421); // id заявки на мероприятие
		var curEventCardTE = OpenDoc(UrlFromDocID(curEventCard)).TopElem; // TopElem карточки мероприятия
		var curUserCardTE = OpenDoc(UrlFromDocID(curUserID)).TopElem; // TopElem карточки сотруника
		var requestTypeTE = OpenDoc(UrlFromDocID(requestTypeId)).TopElem; //TopElem карточки заяки
		
		var new_request_doc = OpenNewDoc("x-local://wtv/wtv_request.xmd");
		new_request_doc.TopElem.object_id = curEventCard;
		new_request_doc.TopElem.person_id = curUserCard;
		tools.common_filling( 'request_type', new_request_doc.TopElem, requestTypeId, requestTypeTE );
		tools.common_filling( 'collaborator', new_request_doc.TopElem, curUserID, curUserCardTE );
		tools.object_filling( new_request_doc.TopElem.type, new_request_doc.TopElem, curEventCard, curEventCardTE );
		new_request_doc.BindToDb(); 
		new_request_doc.Save();
	}

%>