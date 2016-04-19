import toArrayKeys from '../toArrayKeys';

export default {

	values: {
		prev: 'Добавить предварительные тесты',
		post: 'Добавить  пост-тесты'
	},

	toArray: function() {
		return toArrayKeys(this.values);
	}
};