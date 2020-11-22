//this is the main file of backend that is mentioned  in npm package......
//date of making this project is 13/10/2020....(dd/mm/yyyy)
//we use mongoDB database in this project
//Himanshu Sharma B.E 3rd sem

/////////////////////////////*Lets Start*////////////////////////////////

//importing all modules here
require('dotenv').config();//for reading the env file`s data
const express = require('express'); //for the server and its methods
const morgan = require('morgan');//for the dubugging and getting info about client requests...
const cors = require('cors');//for cors error
const path = require('path');//path module inbuild package for the folders and directories
const chalk = require('chalk');//for the beautifying text in terminal 
const pug = require('pug');//template engine
const DBConnection =require('./database/database') //connecting our web to mongoDb Database 
const router =require('./controller/users')//importing our routing form for form validation  and saving to database  
const app = express()


//variable of env file`s data

const __port = process.env.PORT
const __discriptionPage = process.env.DISCRIPTION

//using all middlewere funtions
app.set('view engine','pug')
app.set('views','./All templates')//setting our pug templetes engine


app.use('/routes',router)
app.use(morgan('dev'))
app.use(cors())
app.use(express.static(path.join(__dirname + '/')))



//creating all get method for the home page

app.get('/', (req, res) => {

    res.status(200).sendFile(path.join(__dirname,'/html','home.html'))//for the home page

})

app.get('/resumemaking', (req, res) => {

    res.status(200).sendFile(path.join(__dirname,'/html','form.html'))//for the form for resume page

})

app.get('/jk',(req,res)=>{
    res.render('resume')
})

app.listen(__port, () => {
    console.log(chalk.underline.bgGreenBright.whiteBright(__discriptionPage));//just for the debugging proccess 
})

//end of this project at 1/11/2020
// we can make this more error less afyer editing the editing resume.pug coz imag loded in that from the location not from the database

/*////////////////////////////////////////////////*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/