const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Task = require('../models/task')
const User = require('../models/user')

exports.createUser = async ({userInput}) => {
    const userExists = await User.findOne({email: userInput.email})
    if (userExists) {
        const err = new Error('User already exists.')
        err.code = 400;
        throw err
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 12);

    const user = new User({
        name: userInput.name,
        email: userInput.email,
        password: hashedPassword
    });

    const savedUser = await user.save()
    return savedUser
}

exports.login = async ({email, password}) => {
    const user = await User.findOne({email});
    if (!user) {
        const err = new Error('User with this email not found.')
        err.code = 404;
        throw err
    }

    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
        const err = new Error('Incorrect password.')
        err.code = 401;
        throw err
    }

    const token = jwt.sign({userId: user._id, email}, 'glupitext', {expiresIn: '1h'});

    return {
        userId: user._id,
        token: token,
        tokenExpiration: 1
    }

}

exports.createTask = async ({taskInput}, req) => {
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

    const savedTask = await task.save() // id
    const user = await User.findById(req.userId);
    user.tasks.push(task)
    await user.save()
    return savedTask
}
// /api/getTasks GET
exports.getTasks = async (args, req) => {
    const user = await User.findById(req.userId);
    const popualtedUserData = await user.execPopulate({path: 'tasks', select: 'title  accomplished createdAt' })
    // const tasksTest = await user.execPopulate('Tasks')
    // const tasks = await Task.find({creator: req.userId}).populate({ path: 'creator', select: 'name accomplished' })
    console.log(popualtedUserData);
    return popualtedUserData.tasks
}