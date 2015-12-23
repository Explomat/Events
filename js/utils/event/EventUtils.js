module.exports = {

	getInducingEvent: function (_num) {
		var num = Number(_num);
		if (isNaN(num)) return 'мероприятий';
		var numStr = num.toString();
		var lastNum = Number(numStr.substring(numStr.length - 1));
		if (lastNum === 0) return 'мероприятий';
		else if (lastNum === 1) return 'мероприятие';
		else if (lastNum >=2 && lastNum <=4) return 'мероприятия';
		else if (lastNum >=5 && lastNum <=9) return 'мероприятий';
	},

	getMembers: function(){
		return [
			{ payload: 0, text: 'Участники' },
			{ payload: 1, text: 'Ответственные' },
			{ payload: 2, text: 'Преподаватели' }
		]
	}
}