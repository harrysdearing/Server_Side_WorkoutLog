const express = require('express'); //bring in the express engine
const router = express.Router();

const validateSession = require('../middleware/validate-session');
const Log = require('../database').import('../models/log');

router.post('/create', validateSession, (req, res) => {
    const logEntry = {
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
        owner_id: req.user.id
    }
    Log.create(logEntry)
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({ error: err }))
});

router.get('/', validateSession, (req, res) => {
    Log.findAll({
            where: { owner_id: req.user.id }
        })
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({ error: err }))
});

router.get('/:id', validateSession, (req, res) => {
    Log.findAll({
            where: { id: req.params.id, owner_id: req.user.id }
        })
        .then(log => res.status(200).json(log))
        .catch(err => res.status(500).json({ error: err }))
});

router.put('/update/:id', validateSession, function(req, res) {
    const updateLogEntry = { //this contains the new values we are going to put in the database
        description: req.body.log.description,
        definition: req.body.log.definition,
        result: req.body.log.result,
    };

    const query = { where: { id: req.params.id, owner_id: req.user.id } };

    Log.update(updateLogEntry, query) //this is what is going to be replaced
        .then((log) => res.status(200).json(log))
        .catch((err) => res.status(500).json({ error: err }));
});

router.delete('/delete/:id', validateSession, function(req, res) {
    const query = { where: { id: req.params.id, owner_id: req.user.id } }; //id allows a parameter to be passed through the URL to the server so we can use it later

    Log.destroy(query)
        .then(() => res.status(200).json({ message: 'Entry Removed' }))
        .catch((err) => res.status(500).json({ error: err }));
})

module.exports = router;