const express = require('express');
const app = express();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
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

// test csv file creation
app.get('/', async(req, res) => {
  const csvWriter = createCsvWriter({
    path: 'reports/first_report.csv',
    header: [
      {id: 'position', title:'Position'},
      {id: 'name', title: 'Name'},
      {id: 'tasks', title: 'Tasks'}
    ]
  })
  const data = [
    {
      position: 1,
      name: 'Pedrito Ortega',
      tasks: 3
    },
    {
      position: 2,
      name: 'Sandra Cardenas',
      tasks: 2
    },    {
      position: 3,
      name: 'Federico Pedraza',
      tasks: 1
    },
  ]
  csvWriter
  .writeRecords(data)
  .then(() => { console.log('CSV file written successfully') })
  res.send('OK')
})

// Top ‘N” joiners by “X” stack
app.get('/top/:number/:stack', async (req,res)=>{
  const {number,stack} = req.params
  res.send(`Top ${number} of ${stack} new joiners`)
  console.log(`This is the top ${number} of ${stack} new joiners`)
  const topList = await top(number,stack)
  console.log('Object;', topList, 'Size:', Object.keys(topList).length)
})

// Tasks completed and pending by joiner.
app.get('/count_tasks_by_joiner', async(req,res) =>{
  console.log('Count of tasks completed / uncompleted by joiner')
  const tasksByJoiner = await countOfTasksByJoiner()
  console.log(tasksByJoiner)
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