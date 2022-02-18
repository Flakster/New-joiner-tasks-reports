const fetch = require('node-fetch');

const request = async() => {
  const res = await fetch('https://nnxnkla664.execute-api.us-east-1.amazonaws.com/tasks/list')
  const data = await res.json()
  return data
}

module.exports = request