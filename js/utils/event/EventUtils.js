module.exports = {

	getNumEnding: function(num, endings){
	    var sEnding, i;
	    num = num % 100;
	    if (num >= 11 && num <= 19) {
	        sEnding = endings[2];
	    }
	    else {
	        i = num % 10;
	        switch (i)
	        {
	            case 1: 
	            	sEnding = endings[0]; 
	            	break;
	            case 2:
	            case 3:
	            case 4: 
	            	sEnding = endings[1]; 
	            	break;
	            default: 
	            	sEnding = endings[2];
	        }
	    }
	    return sEnding;
	},

	getInducingEvent: function (_num) {

		var eventEndings = ['мероприятие', 'мероприятия', 'мероприятий']
		var num = Number(_num);
		if (isNaN(num)) return eventEndings[2];
		return this.getNumEnding(num, eventEndings);
	},

	getMembers: function(){
		return [
			{ payload: 0, text: 'Участники' },
			{ payload: 1, text: 'Ответственные' },
			{ payload: 2, text: 'Преподаватели' }
		]
	},

	prepareRegions: function(arr){
		return arr.map(function(item){
			if (item.payload && item.text) return item;
			return {
				payload: item,
				text: item
			};
		});
	}
}