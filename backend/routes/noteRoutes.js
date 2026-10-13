const express = require('express');
const noteController = require('../controllers/noteController');

const router = express.Router();

router.get('/api/notes', noteController.getNotes);
router.post('/api/notes', noteController.createNote);
router.delete('/api/notes/:id', noteController.deleteNote);

module.exports = router;
