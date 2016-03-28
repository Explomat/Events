export default function toArrayKeys(obj) {
	return Object.keys(obj).map(key => {
		return {
			payload: key,
			text: obj[key]
		}
	})
}
