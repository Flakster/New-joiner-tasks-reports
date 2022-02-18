const express = require('express');
const app = express();
const config = require('./utils/config');
const request = require('./helpers/data');

// Settings
app.set('port', config.PORT)

// Routes

app.get('/', async (req,res) =>{
  try {
    const response = await request()
    const {tasks} = response.body
    tasks.forEach((e) =>{
      console.log(`Name ==> ${e.name}, done: ${e.done}`)
    })
  } catch (error) {
    console.log(error)
  }
  res.end('Hello from reports microservice');
})

// Top ‘N” joiners by “X” stack
app.get('/top/:number/:stack', async (req,res)=>{
  const {number,stack} = req.params
  res.send(`This is the top ${number} of ${stack} new joiners`)
  console.log(`This is the top ${number} of ${stack} new joiners`)
  try {
    const response = await request()
    const {tasks} = response.body
    tasks.forEach((e) =>{
      console.log(`Name ==> ${e.name}, done: ${e.done}`)
    })
  } catch (error) {
    console.log(error)
  }

})
// Top ‘N” joiners by “X” stack (order by amount of task completed).
// Tasks completed and pending by joiner.
// Task completed an uncompleted by “X” joiner.
// Days left to complete the tasks by joiner

module.exports = app;