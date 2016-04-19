import toArrayKeys from '../toArrayKeys';

export default {

	values: {
		prev: 'предварительный тест',
		post: 'пост-тест'
	},

	toArray: function() {
		return toArrayKeys(this.values);
	}
};