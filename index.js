const express = require('express');
const { json } = require('express/lib/response');
const app = express();
const fs = require('fs');
const { format } = require('path');
const filePath = './data.json';

app.use('/static', express.static('assets'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home', { success: true });
});

app.get('/tasks', (req, res) => {
  res.render('tasks');
});
// /////////////////////////////////////////
fs.readFile(filePath, (err, data) => {
  if (err) throw err;
  const tasks = JSON.parse(data);
  console.log(tasks);
});
///////////////////////////
app.post('/tasks/add', (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) throw err;
    const FormData = req.body;
    const tasks = JSON.parse(data);
    const task = {
      id: id(),
      content: FormData.task,
      done: false,
    };
    console.log(task);

    tasks.push(task);

    fs.writeFile(filePath, JSON.stringify(tasks), (err) => {
      if (err) throw err;

      fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        const tasks = JSON.parse(data);

        res.render('tasks', { tasksData: tasks });
      });
    });
    console.log(FormData.task);

    //////////////////
    res.redirect('/tasks');
  });
});
// app.post('/tasks/add', (req, res) => {
//   let FormData = req.body;
//   fs.readFile(filePath, (err, data) => {
//     if (err) throw err;
//     const tasks = JSON.parse(data);
// const task = {
//   id: id(),
//   content: FormData.task,
//   done: false,
// };

//     tasks.push(task);

//     fs.writeFile(
//       filePath,
//       JSON.stringify(tasks, (err) => {
//         if (err) throw err;

//         fs.readFile(filePath, (err, data) => {
//           if (err) throw err;

//           const tasks = JSON.parse(date);
//           res.render('tasks', { success: true, tasksData: tasks });
//         });
//       })
//     );
//   });
// });

function id() {
  return '_' + Math.random().toString(36);
}
app.listen(8080, () => {
  console.log('Listening on port 8080...');
});
