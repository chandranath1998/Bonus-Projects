const mongoose = require("mongoose")
const express = require("express")
const route = require("./routes/route")
const app = express()
app.use(express.json())

mongoose.set('strictQuery', true);

mongoose.connect("mongodb+srv://cassmmmg:Functionup2022@cluster0.quflkwm.mongodb.net/bonusProject-1", {useNewUrlParser:true})

    .then(() => console.log("Mongodb Is connected"))
    .catch(err => console.log(err))

app.use('/', route)

app.listen(3000, function() {
    console.log("Express app is Running on port",3000)
})

