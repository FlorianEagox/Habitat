import monk from 'monk';
export const db = monk("mongodb://localhost/habitat");

export function toPublic(doc) {
	function scrub (obj) {
		if (!obj) return null;
		obj.id = obj._id;
		delete obj._id;
		return obj;

	}
	return !Array.isArray(doc) ? scrub(doc) : doc.map(d => scrub(d));
}