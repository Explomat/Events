module.exports = {

	compare: function (firstDate, secondDate) {
		var firstDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
		var secondDate = new Date(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
		return firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getDate() === secondDate.getDate();
	},

	getTime: function(date){
		return date.getHours() + ':' + ("0" + date.getMinutes()).slice(-2);
	},

	getYears: function(curYear){
		return [
			{ payload: curYear - 1, text: curYear - 1},
			{ payload: curYear, text: curYear},
			{ payload: curYear + 1, text: curYear + 1},
		]
	},

	getMonths: function(){
		return [
			{ payload: 0, text: 'Январь'},
			{ payload: 1, text: 'Февраль'},
			{ payload: 2, text: 'Март'},
			{ payload: 3, text: 'Апрель'},
			{ payload: 4, text: 'Май'},
			{ payload: 5, text: 'Июнь'},
			{ payload: 6, text: 'Июль'},
			{ payload: 7, text: 'Август'},
			{ payload: 8, text: 'Сентябрь'},
			{ payload: 9, text: 'Октябрь'},
			{ payload: 10, text: 'Ноябрь'},
			{ payload: 11, text: 'Декабрь'}
		]
	}
}