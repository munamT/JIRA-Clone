const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Issue = mongoose.model('Issue');

const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: false });

//Get All Issues under specific Project
router.get('/:projectId', requireAuth, async (req, res, next) => {
    const { projectId } = req.params;
    try {
        const issue = await Issue.find({ project: projectId });
        res.json(issue);
    } catch(err){
        res.status(204).send({ error: 'No issues found for this project.' });
    }
})

//Create issue under specific Project
router.post('/createIssue/:projectId', requireAuth, async (req, res, next) => {
    const { issueType, summary, description, priority, assignee } = req.body;
    const reporter = req.user._id;
    const { projectId } = req.params;

    const newIssue = new Issue({ issueType, summary, description, priority, assignee, project, reporter, project: projectId });

    if(!issueType || !summary || !description || !priority || !assignee || !reporter || !project){
        res.status(422).send({ error: 'You must fill in all required fields!' });
    }

    try {
        const saved = await newIssue.save();
        res.status(200);
        res.json({ message: 'Issue successfully created!' });
        return true;
    } catch (err) {
        res.send(err);
        return false;
    }

});

//Edit Issue
router.put('/:issueId', async (req, res, next) => {
    const { issueId } = req.params;
    const { issueType, summary, description, priority, assignee } = req.body;

    try {
        const issue = await Issue.findById(issueId);
        issue.issueType = issueType;

        const saved = await issue.save();
        res.status(200).send(saved);
    } catch(err){
        res.status(500).send(err);
    }
})

//Delete Issue
router.delete('/:issueId', async (req, res, next) => {
    const { issueId } = req.params;
    
    try {
        const issue = await Issue.remove({ _id: issueId });
        res.status(200).send(issue);
    } catch(err){
        res.status(404).send(err);
    }
})



module.exports = router;