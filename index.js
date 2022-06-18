const connectToMongo = require('./db')
var cors = require("cors")

connectToMongo();

const express = require('express')
const app = express()
const port = 5000

app.use(express.json())

app.use(cors())


// available routes

app.use('/api/auth',require('./Routes/auth.js'))
app.use('/api/note',require('./Routes/note.js'))
app.use('/api/comment',require('./Routes/comment.js'))


// app.use('/api/shop',require('./Routes/shop.js'))  !! sorry,its a practice route just ignore it...... Thanks


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})