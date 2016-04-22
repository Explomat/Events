import toArrayKeys from '../toArrayKeys';

export default {

	values: {
		prev: 'Выбрать предварительные тесты',
		post: 'Выбрать пост-тесты'
	},

	toArray: function() {
		return toArrayKeys(this.values);
	}
};