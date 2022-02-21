const fetch = require('node-fetch');

const request = async() => {
  const res = await fetch('http://192.168.1.21:8080/profiles')
  const data = await res.json()
  return data
}

module.exports = request