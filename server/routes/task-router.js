const express = require('express')

const TaskCtrl = require('../controllers/task-ctrl')

const router = express.Router()

router.post('/task', TaskCtrl.createTask)
router.put('/task/:id', TaskCtrl.updateTask)
router.delete('/task/:id', TaskCtrl.deleteTask)
router.get('/task/:id', TaskCtrl.getTaskById)
router.get('/task/process/:id', TaskCtrl.getTaskByProcess)
router.get('/tasks', TaskCtrl.getTasks)

module.exports = router