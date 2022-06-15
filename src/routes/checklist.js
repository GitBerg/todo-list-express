const express = require('express');

const router = express.Router()

const Checklist = require('../models/checklist')

const getCheckList = (req, res) => {
    res.send('<h1>Get Request Worked</h1>');
}

const checkIsDone = async () =>{
    try {
        let count = 0;
        let arr = [];
        let checklists = await Checklist.find({}).populate('tasks')
        checklists.forEach(checklist => {
            checklist.tasks.forEach(task =>{
                if(task.done === true)
                    count++
            })
            arr.push(count)
        })
        return arr
    } catch (error) {
        console.log(error);
    }
 
}

router.get('/', async (req, res) => {
    try {
        let checklists = await Checklist.find({})
        let newArr = await checkIsDone()
        res.render('checklists/index', {checklists: checklists, isDone: newArr})
    } catch (error) {
        res.send(error.message)
        //res.render('checklists/error', {error: "Algum erro encontrado"})
    }
})

router.get('/new', async(req, res) => {
    try {
        const checklist = new Checklist()
        res.render('checklists/new', {checklist: checklist})
    } catch (error) {
        res.status(500).render('checklists/error', {error: "Algum erro encontrado"})
    }
})

router.post('/', async (req, res) => {
    let { name } = req.body.checklist;
    const checklist = new Checklist({name})
    try {
        await checklist.save()
        res.redirect('/checklists')
    } catch (error) {
        res.status(500).render('checklists/new', {checklist: {...checklist, error}})
    }
})

router.get('/:id/edit', async(req, res) => {
        const { id } = req.params
    try {
        let checklist = await Checklist.findById(id)
        res.render('checklists/edit', {checklist: checklist})
    } catch (error) {
        res.status(422).render('checklists/error', {error: "Algum erro encontrado"})
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        let checklist = await Checklist.findById(id).populate('tasks')
        res.render('checklists/show', {checklist: checklist})
    } catch (error) {
        res.render('checklists/error', {error: "Algum erro encontrado"})
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { name } = req.body.checklist
    let checklist = await Checklist.findById(id)
    try {
        await checklist.update({name})
        res.redirect('/checklists')
    } catch (error) {
        let errors = error.errors
        res.status(422).render(`checklists/${id}/edit`, {checklist: {...checklist, errors}})
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Checklist.findByIdAndRemove(id)
        res.redirect('/checklists')
    } catch (error) {
        let errors = error.errors
        res.status(422).render(`checklists/`, {checklist: {...checklist, errors}})
    }
})

module.exports = router;