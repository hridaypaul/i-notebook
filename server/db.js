const mongoose = require('mongoose')
const mongoURL = "mongodb://localhost:27017"

const connectToMongo =()=>{
 mongoose.connect(mongoURL).then(console.log('connected'))
 
 
}

module.exports = connectToMongo;