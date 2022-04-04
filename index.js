const { resolveSoa } = require('dns');
const express = require('express');
const { json } = require('express/lib/response');
const app = express();
const sqlite3 = require('sqlite3').verbose();

// const fs = require('fs');
// const { format } = require('path');
// const filePath = './data.json';
// const { body, validationResult } = require('express-validator');

//connect to sqlite3 database
// Creating connection with sqlite3 database
const db = new sqlite3.Database(
  './student.db',
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.log(err.message);

    console.log('Connected successfully!');
  }
);

// creating tasks table
// db.run(
//   'create table tasks (id integer primary key, content varchar(255), done int)'
// );

app.use('/static', express.static('assets'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home', { success: true });
});

app.get('/tasks', (req, res) => {
  db.all('select * from tasks where done = 0', [], (err, data) => {
    if (err) throw err;
    res.render('tasks', { tasks: data });
  });

  // res.render('tasks');
  // });
});

// adding a new task
app.post('/tasks/add', (req, res) => {
  const formData = req.body;

  taskInsert = 'insert into tasks(content, done) values (?, ?)';
  db.run(taskInsert, [formData.task, '0'], (err) => {
    if (err) throw err;

    console.log('New task added');

    res.redirect('/tasks');
  });
});

// deleting uncompleted task
app.get('/tasks/:id/deleteundone', (req, res) => {
  id = req.params.id;
  db.run('DELETE FROM tasks where id=?', id, (err) => {
    if (err) throw err;
    res.redirect('/tasks');
  });
  // res.render('edit');
});

// deleting completed task
app.get('/tasks/:id/deletedone', (req, res) => {
  id = req.params.id;
  db.run('DELETE FROM tasks where id=?', id, (err) => {
    if (err) throw err;
    res.redirect('/complete');
  });
});

//////////////////////////////////////////////////
// db.run('update tasks set done = 1 where id = 1');
// db.all('select * from tasks', [], (err, rows) => {
//   if (err) return console.log(err.message);

//   rows.forEach((row) => {
//     console.log(row);
//   });
// });

function id() {
  return '_' + Math.random().toString(36);
}
app.listen(8080, () => {
  console.log('Listening on port 8080...');
});
