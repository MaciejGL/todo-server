const Task = require('../models/task')
const User = require('../models/user')



exports.createTask = async ({taskInput}, req) => {
    try {
        if (!req.isAuth) {
            const err = new Error('You are not authorized.')
            err.code = 401;
            throw err
        }
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
    try {
        const user = await User.findById(req.userId);
        const popualtedUserData = await user.execPopulate({path: 'tasks', select: 'title  accomplished createdAt' })
        return popualtedUserData.tasks
    } catch (error) {
        throw error
    }
}
