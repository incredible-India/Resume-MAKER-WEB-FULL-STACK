const mongoose = require('mongoose');

var userData = mongoose.Schema;

var usersInfo = new userData({
    //creating schemas in our database
    fname: {
        type: String,
        required: true,
        min: 3,
        max: 25
    },
    lname: {
        type: String,
        required: true,
        min: 3,
        max: 25
    },
    fathername: {
        type: String,
        required: true,
        min: 3,
        max: 25
    },
    education: {
        type: String,
        required: true,
        min: 3,
        max: 150
    },
    address: {
        type: String,
        required: true,
        min: 5,
        max: 100
    },
    city: {
        type: String,
        required: true,
        min: 3,
        max: 25
    },
    state: {
        type: String,
        required: true,

    },
    zip: {
        type: Number,
        required: true,

    },
    skills: {
        type: String,
        required: true,
        min: 5,
        max: 200
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        data: Buffer,
        contentType: String
        
    },
    dob:{
        type:String,
        required:true
    }
    ,
    datemaking: {
        type: Date,
        default: Date.now()
    },
    imgpath:{
        type:String
    }
})


module.exports =mongoose.model('userBiodata',usersInfo)//making model collections and exporting in index.js