const Task = require('../models/Task');
const Client = require('../models/Client');

const getTasksByClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const tasks = await Task.find({ client: clientId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { client, title, description, category, due_date, priority } = req.body;

    if (!client || !title || !description || !category || !due_date || !priority) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const clientExists = await Client.findById(client);
    if (!clientExists) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const task = await Task.create({
      client,
      title,
      description,
      category,
      due_date,
      priority,
      status: 'Pending',
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'Pending' ? 'Completed' : 'Pending';
    await task.save();

    res.json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasksByClient, createTask, updateTaskStatus };
