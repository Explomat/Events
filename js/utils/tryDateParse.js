export default function tryDateParse(date){
	if (date === null){
		return '';
	}
	let _date = Date.parse(date);
	if (!isNaN(_date)){
		return new Date(_date);
	}
	return '';
}