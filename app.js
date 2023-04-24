const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());

const tasks = [];

app.post('/v1/tasks', (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    is_completed: false,
  };
  tasks.push(newTask);
  res.status(201).json({ id: newTask.id });
});

app.get('/v1/tasks', (req, res) => {
  res.status(200).json({ tasks });
});

app.get('/v1/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    res.status(200).json(task);
  }
});

app.delete('/v1/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  }
});

app.put('/v1/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    res.status(404).json({ error: 'There is no task at that id' });
  } else {
    tasks[taskIndex].title = req.body.title;
    tasks[taskIndex].is_completed = req.body.is_completed;
    res.status(204).send();
  }
});

app.post('/v1/tasks/bulk', (req, res) => {
  const newTasks = req.body.tasks.map((t) => ({
    id: tasks.length + 1,
    title: t.title,
    is_completed: t.is_completed,
  }));
  tasks.push(...newTasks);
  res.status(201).json({ tasks: newTasks.map((t) => ({ id: t.id })) });
});

app.delete('/v1/tasks/bulk', (req, res) => {
  const taskIds = req.body.tasks.map((t) => t.id);
  tasks = tasks.filter((t) => !taskIds.includes(t.id));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});