const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { DATABASE_URL } = require('../config');
const Todo = require('../models/toDo');



router.get('/todos', (req, res, next) => {
  Todo.find({})
    .then(todos => res.send(todos))
    .catch(err => {
      console.error(err);
    });
});

router.get('/todos/:id', (req, res, next) => {
  const id = req.params.id;
  Todo.findById(id)
    .then(item => {
      if (item) {
        res.json(item.serialize());
      } else {
        next();
      }
    })
    .catch(next);
});

router.post('/todos', (req, res, next) => {
  const { title } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  // Using promises
  Todo.create({title})
    .then(newItem => {
      res.status(201)
        .location(`${req.originalUrl}/${newItem.id}`)
        .json(newItem.serialize());
  })
    .catch(next);
});

router.put('/todos/:id', (req, res, next) => {
  const id = req.params.id;
  /***** Never trust users - validate input *****/
  const updateItem = {};
  const updateableFields = ['title', 'completed'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updateItem[field] = req.body[field];
    }
  });
  /***** Never trust users - validate input *****/
  if (!updateItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  // Using promises
  Todo.findByIdAndUpdate(id, updateItem, { new: true })
    .then(item => {
      if (item) {
        res.json(item.serialize());
      } else {
        next();
      }
    })
    .catch(next);
});

router.delete('/todos/:id', (req, res, next) => {
  const id = req.params.id;
  // Using promises
  Todo.findByIdAndRemove(id)
    .then(count => {
      if (count) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);
});

module.exports = router;
