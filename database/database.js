const mongoose = require('mongoose');//mongoose module for the performing database operations
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology: true,
    useCreateIndex:true
},(error,dataResult)=>{

if(error)
{
    console.log(process.env.ERR_MESSAGE);
}else
{

    console.log(process.env.SUCC_MESSAGE);
}


})
