const express = require('express');
const {
  getTasksByClient,
  createTask,
  updateTaskStatus,
} = require('../controllers/taskController');

const router = express.Router();

router.get('/:clientId', getTasksByClient);
router.post('/', createTask);
router.put('/:id', updateTaskStatus);

module.exports = router;
