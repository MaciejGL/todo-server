module.exports = {
	fixData: (data) =>
		data.map((obj) => ({
			...obj._doc,
			_id: obj._id.toString(),
			createdAt: obj.createdAt.toISOString(),
			updatedAt: obj.updatedAt.toISOString(),
		})),
	asyncHelper: (fn) => {
		return (args, req) => {
			return fn(args, req).catch((err) => {
				throw err;
			});
		};
	},
};
