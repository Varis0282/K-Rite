const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');
const Task = require('../model/taskModel');
const privateResource = require('../middleware/privateResource');


// create a new task
router.post('/', privateResource, async (req, res) => {
    try {
        const { title, description, priority, deadline } = req.body;
        if (!title || !description || !priority || !deadline) {
            return res.status(422).json({ message: 'Please fill all the fields', success: false });
        }
        if (priority !== 'Low' && priority !== 'Medium' && priority !== 'High') {
            return res.status(422).json({ message: 'Priority should be Low, Medium or High', success: false });
        }
        if (new Date(deadline) < new Date()) {
            return res.status(422).json({ message: 'Deadline should be a future date', success: false });
        }
        const task = new Task({
            title,
            description,
            priority,
            deadline,
            status: 'Pending',
            user: req.user._id
        });
        await task.save();
        return res.status(201).json({ message: 'Task created successfully', success: true, task });
    } catch (err) {
        console.log("Error in /create", err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// get all tasks
router.get('/', privateResource, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        return res.status(200).json({ tasks, success: true , message: 'Tasks fetched successfully'});
    } catch (err) {
        console.log("Error in /", err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// get a task by id
router.get('/:id', privateResource, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        return res.status(200).json({ task, success: true });
    } catch (err) {
        console.log("Error in /:id", err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// update a task by id
router.put('/:id', privateResource, async (req, res) => {
    try {
        const { description, priority, deadline, status } = req.body;
        if (!description || !priority || !deadline || !status) {
            return res.status(422).json({ message: 'Please fill all the fields', success: false });
        }
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this task', success: false });
        }
        if (priority !== 'Low' && priority !== 'Medium' && priority !== 'High') {
            return res.status(422).json({ message: 'Priority should be Low, Medium or High', success: false });
        }
        if (new Date(deadline) < new Date()) {
            return res.status(422).json({ message: 'Deadline should be a future date', success: false });
        }
        if (status !== 'Pending' && status !== 'In Progress' && status !== 'Completed') {
            return res.status(422).json({ message: 'Status should be Pending, In Progress or Completed', success: false });
        }
        task.description = description;
        task.priority = priority;
        task.deadline = deadline;
        task.status = status;
        await task.save();
        return res.status(200).json({ message: 'Task updated successfully', success: true, task });
    } catch (err) {
        console.log("Error in /:id", err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});

// delete a task by id
router.delete('/:id', privateResource, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this task', success: false });
        }
        const result = await Task.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        return res.status(200).json({ message: 'Task deleted successfully', success: true });
    } catch (err) {
        console.log("Error in /:id", err);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
});


module.exports = router;
