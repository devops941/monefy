const Note = require('../models/Note');

const getNotes = async () => {
  return await Note.find().sort({ createdAt: -1 });
};

const createNote = async (title, content) => {
  const newNote = new Note({ title, content });
  return await newNote.save();
};

const deleteNote = async (id) => {
  return await Note.findByIdAndDelete(id);
};

module.exports = {
  getNotes,
  createNote,
  deleteNote
};
