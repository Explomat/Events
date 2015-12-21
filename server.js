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

	function getEvents(queryObjects) {
		var selectedYear = Int(queryObjects.year);
		var selectedMonth = Int(queryObjects.month);

		var firstDate = StrXmlDate(Date("1."+selectedMonth+"."+selectedYear));
		var lastDate = StrXmlDate(getLastDate(selectedYear, selectedMonth));

		var getEventArray = XQuery("sql: 
			select events.id as id, 
			REPLACE(events.name, '\"', '''') as name,
			events.type_id as type,
			events.start_date as startDate,
			events.finish_date as finishDate,
			events.status_id as status
			from events where 
			(events.start_date < '"+lastDate+"' and
			events.start_date >= '"+firstDate+"') and
			events.status_id <> 'cancel'
			");
		var eventsArray = [];
		for (e in getEventArray) {
			e.type = e.type == 'webinar' ? 'webinar' : 'full_time';
			eventsArray.push({ id: Int(e.id), name: e.name + '', type: e.type + '', startDate: StrMimeDate(e.startDate), finishDate: StrMimeDate(e.finishDate), status: e.status + '', place: 'Саввик' });
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

%>