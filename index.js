const { resolveSoa } = require('dns');
const express = require('express');
const { json } = require('express/lib/response');
const app = express();
const sqlite3 = require('sqlite3').verbose();

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
});

// adding a new task
app.post('/tasks/add', (req, res) => {
  const formData = req.body;

  if (formData.task.length === 0) {
    db.all('select * from tasks where done = 0', [], (err, data) => {
      if (err) throw err;
      res.render('tasks', { tasks: data, error: true });
    });
  } else {
    taskInsert = 'insert into tasks(content, done) values (?, ?)';
    db.run(taskInsert, [formData.task, '0'], (err) => {
      if (err) throw err;

      console.log('New task added');

      db.all('select * from tasks where done = 0', [], (err, data) => {
        if (err) throw err;
        res.render('tasks', { tasks: data, success: true });
      });
    });
  }
});

// deleting uncompleted task
app.get('/tasks/:id/deleteundone', (req, res) => {
  id = req.params.id;
  db.run('DELETE FROM tasks where id=?', id, (err) => {
    if (err) throw err;
    res.redirect('/tasks');
  });
});

// deleting completed task
app.get('/tasks/:id/deletedone', (req, res) => {
  id = req.params.id;
  db.run('DELETE FROM tasks where id=?', id, (err) => {
    if (err) throw err;
    res.redirect('/complete');
  });
});

// going to edit page
app.get('/tasks/:id/update', (req, res) => {
  let id = req.params.id;
  db.get('select * from tasks where id = ?', id, (err, row) => {
    res.render('edit', { id: id, task: row });
  });
});

//updating selected student record
app.post(`/tasks/:id/update`, (req, res) => {
  id = req.params.id;
  let formData = req.body;
  let update = 'update tasks set content = ? where id = ?';
  if (formData.task.length === 0) {
    db.get('select * from tasks where id = ?', id, (err, row) => {
      res.render('edit', { id: id, task: row, error: true });
    });
  } else {
    db.run(update, [formData.task, req.params.id], (err) => {
      if (err) throw err;
    });
    res.redirect('/tasks');
  }
});

//going to completed page
app.get('/complete', (req, res) => {
  db.all('select * from tasks where done=1', [], (err, data) => {
    if (err) throw err;
    res.render('complete', { tasks: data });
  });
});

// completing a task
app.get('/tasks/:id/complete', (req, res) => {
  let id = req.params.id;
  const complete = 'update tasks set done = 1 where id = ?';
  db.run(complete, [id], (err) => {
    if (err) throw err;
    res.redirect('/tasks');
  });
});

// uncompleting a task
app.get('/tasks/:id/uncomplete', (req, res) => {
  let id = req.params.id;
  const unComplete = 'update tasks set done = 0 where id = ?';
  db.run(unComplete, [id], (err) => {
    if (err) throw err;
    res.redirect('/complete');
  });
});

function id() {
  return '_' + Math.random().toString(36);
}
app.listen(8080, () => {
  console.log('Listening on port 8080...');
});
