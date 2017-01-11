import tryDateParse from './tryDateParse';

//state = { types: { [key]: date, [key1]: integer }, data: [{ [key]: value, [key1]: value1 }, {... }] }
export default function prepareTableState(state){
	const {types, data} = state;
	return data.map(item => {
		let newObj = {};
		Object.keys(item).forEach(key => {
			if (key in types){
				let type = types[key];
				if (type === 'date'){
					newObj[key] = tryDateParse(item[key]);
				}
				else if (type === 'integer'){
					newObj[key] = Number(item[key]);
				}
				else {
					newObj[key] = item[key];
				}
			}
			else {
				newObj[key] = item[key];
			}
		})
		return newObj;
	})
}