const Express = require('express');
const validateJWT = require('../middleware/validate-jwt');
const router = Express.Router();
const { Log } = require('../models');

router.post('/', validateJWT, async(req, res) => { // creates logs for verified user
    try {
        const { description, definition, result } = req.body.log;
        const logEntry = {
            description,
            definition,
            result,
            owner_id: req.user.id
        }

        const newLog = await Log.create(logEntry);
        res.status(200).json(newLog);
    } catch(err) {
        res.status(500).json({
            message: `Error: ${err}`
        })
    }
});

router.get('/', validateJWT, async(req, res) => { // gets all logs for an individual user
    try {
        const owner_id = req.user.id;
        const query = {
            where: {
                owner_id
            }
        }
        const logEntries = await Log.findAll(query);
        res.status(200).json(
            logEntries
        )
    } catch (err) {
        res.status(500).json({
            message: `Error: ${err}`
        })
    }
})

router.get('/:id', validateJWT, async(req, res) => { // gets individual logs by id for an individual user
    try {
        const logId = req.params.id;
        const owner_id = req.user.id;
        const query = {
            where: {
                id: logId,
                owner_id
            }
        }
        const logEntry = await Log.findOne(query);
        if (logEntry) {
            res.status(200).json(
                logEntry
            )
        } else {
            res.status(404).json({
                message: 'Workout log ID not found'
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Error: ${err}`
        })
    }
})

router.put('/:id', validateJWT, async(req, res) => { // allows individual logs to be updated by a user
    try {
        const { description, definition, result } = req.body.log;
        const logId = req.params.id;
        const owner_id = req.user.id;

        const query = {
            where: {
                id: logId,
                owner_id
            }
        };

        const updatedLog = {
            description,
            definition,
            result,
            owner_id
        };

        const update = await Log.update(updatedLog, query);
        if (update != 0) {
            res.status(200).json(
                updatedLog
            )
        } else {
            res.status(404).json({
                message: `Workout log #${logId} not found`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Error: ${err}`
        })
    }
})


router.delete('/:id', validateJWT, async(req, res) => { // allows individual logs to be deleted by a user
    try {
        const logId = req.params.id;
        const owner_id = req.user.id;

        const query = {
            where: {
                id: logId,
                owner_id
            }
        };

        const deleted = await Log.destroy(query);
        if (deleted != 0) {
            res.status(200).json(
                deleted
            )
        } else {
            res.status(404).json({
                message: `Workout log #${logId} not found`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Error: ${err}`
        })
    }
})


module.exports = router;