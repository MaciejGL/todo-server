const Task = require('../models/task')
const User = require('../models/user')



exports.createTask = async ({taskInput}, req) => {
    if (!req.isAuth) {
        const err = new Error('You are not authorized.')
        err.code = 401;
        throw err
    }
    try {
        const task = new Task({
            title: taskInput.title,
            subtitle: taskInput.subtitle,
            description: taskInput.description,
            creator: req.userId
        });
    
        const savedTask = await task.save()
        const user = await User.findById(req.userId);
        user.tasks.push(task)
        await user.save()
        return savedTask
    } catch (error) {
        throw error
    }
}

exports.getTasks = async (args, req) => {
    if (!req.isAuth) {
        const err = new Error('You are not authorized.')
        err.code = 401;
        throw err
    }
    try {
        const user = await User.findById(req.userId);
        const popualtedUserData = await user.execPopulate({path: 'tasks'});
        return popualtedUserData.tasks
    } catch (error) {
        throw error
    }
}

exports.getTask = async ({id}, req) => {
    if (!req.isAuth) {
        const err = new Error('You are not authorized.')
        err.code = 401;
        throw err
    }
    try {
        const user = await User.findById(req.userId)
        const taskId = user.tasks.find(task => task._id.toString() === id.toString());
        const task = await Task.findOne({_id: taskId})
        return task
    } catch (error) {
        throw error
    }
}

exports.deleteTask = async ({id}, req) => {
    if (!req.isAuth) {
        const err = new Error('You are not authorized.')
        err.code = 401;
        throw err
    }
    try {
        const task = await Task.findOneAndDelete({_id: id})
        const user = await User.findById(req.userId)
        const userTasks = user.tasks.filter(task => task.toString() !== id.toString())
        user.tasks = userTasks;
        await user.save()
        return task
    } catch (error) {
        throw error
    }
}
