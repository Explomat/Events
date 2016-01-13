<%
	function initRegExp(actionName){
		var objRegExp = new ActiveXObject('VBScript.RegExp');
		objRegExp.Global = true;
		objRegExp.IgnoreCase = false;
		objRegExp.MultiLine = true;
		objRegExp.Pattern = "\\bfunction\\s{1,}" + actionName + "\\b";
		return objRegExp;
	}

	function getMatch(input, actionName) {
		var objRegExp = initRegExp(actionName);
		var matches = objRegExp.Execute(input);
		var firstMatch = null;
		try {
			firstMatch = matches.item(0);
		}
		catch(e) { return null; }
		return firstMatch.Value;
	}

	function changeSourceCode(matchString, inputStr) {
		var inputLen = inputStr.length;
		var startIndex = inputStr.indexOf(matchString);
		var middleIndex = startIndex + matchString.length;
		for (; middleIndex < inputLen - 1; middleIndex++) {
			if (inputStr.charAt(middleIndex) == '{')
				break;
		}
		var countOpenedBrackets = 1;
		var countClosedBarckets = 0;
		var endIndex = middleIndex + 1;
		var ch = inputStr.charAt(endIndex);
		endIndex++;
		do {
			ch = inputStr.charAt(endIndex);
			if (ch == "{") 
				countOpenedBrackets++;
			else if (ch == "}")
				countClosedBarckets++;
			endIndex++;
		}while(countOpenedBrackets > countClosedBarckets)
		
		return StrRangePos(inputStr, 2, startIndex - 1) + StrRangePos(inputStr, middleIndex + 1, endIndex - 1) + StrRangePos(inputStr, endIndex + 1, inputStr.length - 2);
	}


	var query = Request.Query;
	var reqSourceCode = ArrayOptFirstElem(XQuery("sql:select ct.data.value('custom_web_template/html','varchar(MAX)') as source_code from custom_web_template ct where ct.id="+query.server_id));
	if (reqSourceCode != undefined) {
		var sourceCode = String(reqSourceCode.source_code);
		var actionName = String(query.action_name);
		var queryObjects = {Body: Request.Body, Form: Request.Form, Header: Request.Header};
		for (obj in query) {
			if (obj != "object_id" && obj != "action_name" && obj != "server_id") {
				queryObjects.AddProperty(obj, query[obj]);
			}
		}

		var matchString = getMatch(sourceCode, actionName);
		if (matchString != null) {
			var newSourceCode = changeSourceCode(matchString, sourceCode);
			//Response.Write(newSourceCode);
			var result = eval(newSourceCode, queryObjects);
			if (result != null && result != undefined)
				Response.Write(result);
		}
	}
%>