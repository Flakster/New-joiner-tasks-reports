const app = require('./src/app.js');


// main function

async function main(){
  const port = app.get('port')
  await app.listen(port, ()=>{
    console.log('Server is listening on port: ', port)
  })
}

main();