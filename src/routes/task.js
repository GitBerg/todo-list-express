const express = require('express');
const { findById } = require('../models/checklist');

const router = express.Router()
const simpleTaskRouter = express.Router()

const Checklist = require('../models/checklist')
const Task = require('../models/task')

router.get('/:id/tasks/new', async (req, res) => {
    const { id } = req.params;
    try {
        const task = new Task()
        res.render('tasks/new', { task: task, checklistId: id })
    } catch (error) {
        res.status(422).render('checklists/error', { error: "Algum erro encontrado" })
    }
})

router.post('/:id/tasks', async (req, res) => {
    let { name } = req.body.task;
    const { id } = req.params;
    const task = new Task({ name, checklist: id })
    try {
        await task.save()
        const checklist = await Checklist.findById(id)
        checklist.tasks.push(task)
        await checklist.save()
        res.redirect(`/checklists/${id}`)
    } catch (error) {
        let errors = error.errors;
        res.send("algum erro")
    }
})

simpleTaskRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const task = await Task.findByIdAndDelete(id)
        const checklist = await Checklist.findById(task.checklist)
        const removeTask = checklist.tasks.indexOf(task._id)
        checklist.tasks.splice(removeTask, 1)
        await checklist.save()
        res.redirect(`/checklists/${checklist._id}`)
    } catch (error) {
        res.send(error.message)
    }
})

simpleTaskRouter.put('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const task = await Task.findById(id)
        task.set(req.body.task)
        await task.save()
        res.status(200).json({task})
    } catch (error) {
        res.send(error.message)
    }
})


module.exports = { taskRouter: router,  simpleTaskRouter }