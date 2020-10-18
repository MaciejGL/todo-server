const Task = require('../models/task');
const User = require('../models/user');

const { isAuth } = require('../utils/auth');
const { asyncHelper, fixData } = require('../utils/helpers');

exports.createTask = async ({ taskInput }, req) => {
	isAuth(req.isAuth);
	try {
		const task = new Task({
			title: taskInput.title,
			subtitle: taskInput.subtitle,
			description: taskInput.description,
			creator: req.userId,
		});

		const savedTask = await task.save();
		const user = await User.findById(req.userId);
		user.tasks.push(task);
		await user.save();
		return savedTask;
	} catch (error) {
		throw error;
	}
};

exports.getTasks = asyncHelper(async ({ page, perPage }, req) => {
	isAuth(req.isAuth);
	if (!page) {
		page = 1;
	}
	if (!perPage) {
		perPage = 5;
	}
	const totalTasks = await Task.find({ creator: req.userId }).countDocuments();
	const tasksData = await Task.find({ creator: req.userId })
		.sort({ createdAt: -1 })
		.skip((page - 1) * perPage)
		.limit(perPage)
		.populate('creator');
	const tasks = fixData(tasksData);
	// const tasks = tasksData.map((task) => ({
	// 	...task._doc,
	// 	_id: task._id.toString(),
	// 	createdAt: task.createdAt.toISOString(),
	// 	updatedAt: task.updatedAt.toISOString(),
	// }));
	return { tasks, totalTasks };
});

exports.getTask = async ({ id }, req) => {
	isAuth(req.isAuth);
	try {
		const user = await User.findById(req.userId);
		const taskId = user.tasks.find((task) => task._id.toString() === id.toString());
		const task = await Task.findOne({ _id: taskId });
		return task;
	} catch (error) {
		throw error;
	}
};

exports.updateTask = async ({ id, taskInput }, req) => {
	isAuth(req.isAuth);
	try {
		const task = await Task.findByIdAndUpdate(id, taskInput, { new: true });
		return task;
	} catch (error) {
		throw error;
	}
};

exports.deleteTask = async ({ id }, req) => {
	isAuth(req.isAuth);
	try {
		const task = await Task.findOneAndDelete({ _id: id });
		const user = await User.findById(req.userId);
		const userTasks = user.tasks.filter((task) => task.toString() !== id.toString());
		user.tasks = userTasks;
		await user.save();
		return task;
	} catch (error) {
		throw error;
	}
};
