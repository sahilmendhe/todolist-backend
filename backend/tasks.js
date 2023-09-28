const express = require('express');
const router = express.Router();

let tasks = [];

// Create a new task
router.post('/', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Get all tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

// Get a specific task by ID
router.get('/:id', (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(task => task.id === taskId);
    if (!task) {
        res.status(404).json({ error: 'Task not found' });
    } else {
        res.json(task);
    }
});

// Update a task
router.put('/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        res.status(404).json({ error: 'Task not found' });
    } else {
        tasks[taskIndex] = updatedTask;
        res.json(updatedTask);
    }
});

// Update a task partially (using PATCH)
router.patch('/:id', (req, res) => {
    const taskId = req.params.id;
    const updates = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        res.status(404).json({ error: 'Task not found' });
    } else {
        // Apply updates to the existing task
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        res.json(tasks[taskIndex]);
    }
});

// Delete a task
router.delete('/:id', (req, res) => {
    const taskId = req.params.id;
    tasks = tasks.filter(task => task.id !== taskId);
    res.sendStatus(204);
});


module.exports = router;
