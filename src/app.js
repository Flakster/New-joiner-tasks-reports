const express = require('express');
const app = express();
const config = require('./utils/config');
const {
  top,
  countOfTasksByJoiner,
  listOfTasksByJoiner,
  daysTofinish
} = require('./helpers/arrays');

// Settings
app.set('port', config.PORT)

// Routes

// Top ‘N” joiners by “X” stack
app.get('/top/:number/:stack', async (req,res)=>{
  const {number,stack} = req.params
  res.send(`Top ${number} of ${stack} new joiners`)
  console.log(`This is the top ${number} of ${stack} new joiners`)
  await top(number,stack)
})

// Tasks completed and pending by joiner.
app.get('/count_tasks_by_joiner', async(req,res) =>{
  console.log('Count of tasks completed / uncompleted by joiner')
  const tasksByJoiner = await countOfTasksByJoiner()
  tasksByJoiner.forEach(e =>{
    console.log(`${e[0]} ${e[1]} ${e[2]}`)
  })
  res.send('The count of completed/ uncompleted tasks by joiner has been created')
})

// Task completed an uncompleted by “X” joiner.
app.get('/list_tasks_by_joiner/:id', async(req, res) => {
  const {id} = req.params
  const tasksByJoiner = await listOfTasksByJoiner(id)
  console.log(tasksByJoiner)
  res.send('OK')
})

// Days left to complete the tasks by joiner
app.get('/days_joiner/:id', async(req, res) => {
  const {id} = req.params
  const daysLeft = await daysTofinish(id)
  console.log(daysLeft)
  res.send('OK')
})


module.exports = app;