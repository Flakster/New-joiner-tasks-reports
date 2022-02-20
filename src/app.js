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
    
    // Insert the server response into an array
    const stackTasks = []
    tasks.forEach((e) =>{
      let joinerStack = stackTasks.find( a => (a[0] == e.newJoinerId) && a[1] == e.stack)
      if (joinerStack) joinerStack[2]++
      else if (e.newJoinerId !== null && e.done ) stackTasks.push([e.newJoinerId,e.stack,1])
    })

    //console.log (stackTasks.filter(a => a[1]==stack).sort((a,b) => a[2] > b[2]))
    const topArray = stackTasks.filter(a => a[1]==stack).sort((a,b) => b[2] - a[2]) 
    let index = 0
    while (index < number){
      if (index < topArray.length){
        console.log(`${index + 1}. \t${topArray[index][0]}: \t${topArray[index][2]} `)
      }else{
        console.log(`${index + 1}. empty`)
      }
      index++
    } 
  } catch (error) {
    console.log(error)
  }

})
// Top ‘N” joiners by “X” stack (order by amount of task completed).
// Tasks completed and pending by joiner.
// Task completed an uncompleted by “X” joiner.
// Days left to complete the tasks by joiner

module.exports = app;