const Task = require('../models/task')


exports.createTask = async ({taskInput}) => {
    console.log(taskInput);
    const task = new Task({
        title: taskInput.title,
        subtitle: taskInput.subtitle,
        description: taskInput.description,
    })
    const savedTask = await task.save()
    return savedTask
}
exports.getTasks = async () => {
const tasks = await Task.find()
return tasks
}