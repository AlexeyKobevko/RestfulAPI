const Note = require('../models/note.model');

// Create and Save a new Note
exports.create = (req, res) => {
  // Validate request
  if (!req.body.content) {
    return res.status(400).send({
      status: "error",
      message: "Note content can not be empty"
    });
  }
  // Create a Note
  const note = new Note({
    title: req.body.title || "Untitled Note",
    content: req.body.content
  });
  // Save Note in the database
  note.save()
    .then(data => {
      res.send({
        status: "ok",
        message: data
      });
    }).catch(err => {
      res.status(500).send({
        status: "error",
        message: err.message || "Some error occurred while creating the Note."
      });
  });

};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
  Note.find()
    .then(notes => {
      res.send({
        status: "ok",
        message: notes
      });
    }).catch(err => {
      res.status(500).send({
        status: "error",
        message: err.message || "Some error occurred while retrieving notes."
      });
  });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
  Note.findById(req.params.noteId)
    .then(note => {
      if (!note) {
        return res.status(404).send({
          status: "error",
          message: "Note not found with id " + req.params.noteId
        });
      }
      res.send({
        status: "ok",
        message: note
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          status: "error",
          message: "Note not found with id " + req.params.noteId
        });
      }
    return res.status(500).send({
      status: "error",
      message: "Error retrieving note with id " + req.params.noteId
    });
  });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.content) {
    return res.status(400).send({
      status: "error",
      message: "Note content can not be empty"
    });
  }

  // Find note and update it with the request body
  Note.findByIdAndUpdate(req.params.noteId, {
    title: req.body.title || "Untitled Note",
    content: req.body.content
  }, {new: true})
    .then(note => {
      if (!note) {
        return res.status(404).send({
          status: "error",
          message: "Note not found with id " + req.params.noteId
        });
      }
      res.send({
        status: "ok",
        message: note
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          status: "error",
          message: "Note not found with id " + req.params.noteId
        });
      }
    return res.status(500).send({
      status: "error",
      message: "Error updating note with id " + req.params.noteId
    });
  });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Note.findByIdAndRemove(req.params.noteId)
    .then(note => {
      if(!note) {
        return res.status(404).send({
          status: "error",
          message: "Note not found with id " + req.params.noteId
        });
      }
      res.send({
        status: "ok",
        message: "Note deleted successfully!"
      });
    }).catch(err => {
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        status: "error",
        message: "Note not found with id " + req.params.noteId
      });
    }
    return res.status(500).send({
      status: "error",
      message: "Could not delete note with id " + req.params.noteId
    });
  });
};