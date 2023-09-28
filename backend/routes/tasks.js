const express = require('express');
const router = express.Router();
const Task = require('../Task');

async function checkAndAddDefaultTasks() {
    try {
        const tasksCount = await Task.countDocuments();
        if (tasksCount === 0) {
            const defaultTasks = [
                { title: 'Test 1', description: 'Done' },
                { title: 'Test 2', description: 'Ok' },
            ];
            await Task.insertMany(defaultTasks);
        }
    } catch (error) {
        console.error('Error checking or adding default tasks:', error);
    }
}

router.use(async (req, res, next) => {
    await checkAndAddDefaultTasks();
    next();
});

router.post('/', async (req, res) => {
    try {
        const newTask = req.body;
        const task = await Task.create(newTask);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json(task);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching task' });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    const taskId = req.params.id;
    console.log('Task ID:', taskId); // Log the taskId
    console.log('Request Body:', req.body);
    const { _id, ...updatedTaskWithoutId } = req.body; // Exclude _id field
    try {
        const task = await Task.findByIdAndUpdate(taskId, updatedTaskWithoutId, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

// Partially update a task
router.patch('/:id', async (req, res) => {
    const taskId = req.params.id;
    const updates = req.body;
    try {
        const task = await Task.findByIdAndUpdate(taskId, { $set: updates }, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Error updating task' });
    }
});


// Delete a task
router.delete('/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.sendStatus(204);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;
