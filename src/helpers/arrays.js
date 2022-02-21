const { parse } = require('dotenv');
const fetch = require('node-fetch');
const requestJoiners = require('./dataJoiners');
const requestTasks = require('./dataTasks');


const joiners = async() =>{
  try {
    const items = await requestJoiners()
    const joinersObj = {}
    items.forEach((e) =>{
      joinersObj[e.ID] = e.Name + e.LastName
    })
    return joinersObj
  } catch (error) {
    console.log(error)
  }
}

const tasks = async() =>{
  try {
    const response = await requestTasks()
    const {tasks} = response.body
    const tasksArray = []
    tasks.forEach(e => {
        tasksArray.push([e.newJoinerId, e.stack, e.hours, e.done])
    });
    return tasksArray
  } catch (error) {
    console.log(error)
  }
}

const top = async(n,stack) => {

  const joinersObj = await joiners()

  // get the whole tasks list 
  const tasksList = await tasks()

  // initialize the list of tasks filtered by stack
  const tasksByStack = []

  // for each task check who's in charge
  tasksList.forEach(e =>{

    // check if the task is assigned and done
    if (e[0] !== null && e[1] == stack && e[3]){

      let joinerInStack = tasksByStack.find( a => a[0] == e[0] )

      // increase the done tasks counter
      if (joinerInStack) joinerInStack[1]++
      else tasksByStack.push([e[0], 1])
    }
  })
  const sortedArray = tasksByStack.sort( (a,b) => b[1] - a[1] )
  let index = 0
  const resultingObject = {}
  while (index < n){
    if (index < sortedArray.length){
      let joinerId = sortedArray[index][0]
      resultingObject[index+1] = [joinersObj[joinerId], sortedArray[index][1]]
    }else{
      resultingObject[index +1] = ['Empty', 'n/a']
    }
    index++
  }
  return resultingObject
}

const countOfTasksByJoiner = async() => {
  
  const joinersObj = await joiners()

  // get the whole tasks list 
  const tasksList = await tasks()

  // initialize the list of tasks by joiner
  const tasksByJoiner = []

  // for each task check who's in charge
  tasksList.forEach(e =>{

    // check if the task is assigned
    if (e[0] !== null){

      let joinerInStack = tasksByJoiner.find( a => a[0] == e[0] )

      if (joinerInStack){
        if (e[3]) joinerInStack[1]++
        else joinerInStack[2]++
      }else{
        if (e[3]) tasksByJoiner.push([e[0],1,0])
        else tasksByJoiner.push([e[0],0,1])
      } 
    }
  })
  const resultingArray = []
  tasksByJoiner.forEach( e => {
    if (joinersObj[e[0]]) {
      resultingArray.push([joinersObj[e[0]], e[1], e[2]])
    }
  })
  return resultingArray
}

const listOfTasksByJoiner = async(id) => {
  const joinersObj = await joiners()
  if (!joinersObj[id]) return { name: "User doesn't exist" }

  try {
    const response = await requestTasks()
    const {tasks} = response.body
    const completedTasks = []
    const unCompletedTasks = []
    tasks.forEach(e =>{
      if (e.newJoinerId === parseInt(id)){
        if (e.done) completedTasks.push(e.name)
        else unCompletedTasks.push(e.name)
      }
    }) 
    const resultingObject = {
      name: joinersObj[id],
      completed: completedTasks,
      uncompleted: unCompletedTasks
    } 
    return resultingObject
  } catch (error) {
    console.log(error)
  }
}

const daysTofinish = async(id) => {
  const joinersObj = await joiners()
  if (!joinersObj[id]) return { name: "User doesn't exist"}

  try {
    const response = await requestTasks()
    const {tasks} = response.body
    let hoursLeft = 0
    tasks.forEach( e =>{
      if (e.newJoinerId === parseInt(id) && !e.done ){
        hoursLeft += parseInt(e.hours)
      }
    })
    let daysLeft = hoursLeft / 8
    if (daysLeft > 0) return { name: joinersObj[id], daysLeft }
    else return { name: "No pending tasks" }
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  top,
  countOfTasksByJoiner,
  listOfTasksByJoiner,
  daysTofinish
}
