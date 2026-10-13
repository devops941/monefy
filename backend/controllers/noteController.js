const noteService = require('../services/noteService');

const getNotes = async (req, res) => {
  try {
    const notes = await noteService.getNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

const createNote = async (req, res) => {
  try {
    const savedNote = await noteService.createNote(req.body.title, req.body.content);
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

module.exports = {
  getNotes,
  createNote,
  deleteNote
};
