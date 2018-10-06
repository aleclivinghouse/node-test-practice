require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const toDoRouter = require('./routes/toDoRouter');

const Todo = require('./models/toDo');
const { PORT, DATABASE_URL } = require('./config');

const seedData = require('./db/todos.json');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use('/', toDoRouter);


// 404 catch-all
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: (process.env.NODE_ENV === 'development') ? err : {}
  });
});


if (require.main === module) {
  mongoose.connect(DATABASE_URL, { useMongoClient: true })
    .then(() => {
      Todo.insertMany(seedData);
    })
    .catch(err => {
      console.error('ERROR: Mongoose failed to connect! Is the database running?');
      console.error(err);
    });

  app.listen(PORT, function () {
    console.log('Your app is listening on port ' + this.address().port);
  });
}

module.exports = app; // Export for testing
