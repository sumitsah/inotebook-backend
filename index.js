const connectToMongo = require('./db')

// call to connect the DB
connectToMongo();

const express = require('express')
const app = express()
const port = 5000

// Available Routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))

app.use('/api/notes', require('./routes/notes'))



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
