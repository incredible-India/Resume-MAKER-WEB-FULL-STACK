const express = require('express')
const router = express.Router();//routing for urls
const bodyParser = require('body-parser');//getting data from form
const { check, validationResult, matchedData } = require('express-validator')//validation for our data
const multer = require('multer');//for the image in the form
const User = require('./../models/users')//this is our model or collections 
const fs = require('fs');//fs module for storing image in data base
const path = require('path');//built in path module
const bcryptjs = require('bcryptjs');//crypting important data for security issue
const users = require('./../models/users');//forn the mode.
// const urlcrypt = require('url-crypt');//for crypting the url secure purpose....
const urlCrypt = require('url-crypt');
const { find } = require('./../models/users');
const { restart } = require('nodemon');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');
// const popup = require('popups');

var storage = multer.diskStorage({
    destination: 'UserImage'
    // (req, file, cb) => {
    //     cb(null, 'UserImage')
    // }

    , filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_"+file.originalname)
    }
})

var uploads = multer({ storage: storage })

express().set('view engine', 'pug')
express().set('views', './../All templates/')

// router.set('view engine','pug')
// router.set('views','./../All templates/')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))//parsing data from url in json formate
// router.use(express.static('../eefef/'))
router.use(express.static(path.join(__dirname + './../')))

console.log(path.join(__dirname + './../'));


//validating all the fields cross check
router.post('/uploadingData', uploads.single('image'), [
    check('fname').not().isEmpty(),
    check('lname').not().isEmpty(),
    check('fathername').not().isEmpty(),
    check('education').not().isEmpty(),
    check('address').not().isEmpty(),
    check('city').not().isEmpty(),
    check('state').not().isEmpty(),
    check('zip').not().isEmpty(),
    check('dob').not().isEmpty(),
    check('skills').not().isEmpty(),
    // check('email').isEmail().normalizeEmail()
]
    ,


    (req, res) => {



        const erorrInform = validationResult(req)

        if (!erorrInform.isEmpty()) {

            return res.status(422).send(erorrInform.array())

        }

        User.findOne({ email: req.body.email }, (errorMongoDb, isExist) => {

            if (errorMongoDb) {
                return res.send('<h1> It seems your database server is on</h1>')

            }
            else {
                if (isExist) {

                    return res.render('errorEmailPage', { err: "Email is is already in use ,please try defferent one" })

                } else//not exist 
                {
                    new User({//saving all the data in our database
                        fname: req.body.fname.toUpperCase() ,
                        lname: req.body.lname.toUpperCase(),
                        fathername: req.body.fathername.toUpperCase() ,
                        education: req.body.education,
                        address: req.body.address,
                        city: req.body.city.toUpperCase().replace(/\s+/g, '') ,//ye whitespace hta dega
                        state: req.body.state,
                        zip: req.body.zip, 
                        dob: req.body.dob,
                        skills: req.body.skills,
                        email: req.body.email.replace(/\s+/g, ''),
                        imgpath:req.file.filename,
                        img: {
                            data: fs.readFileSync(path.join(__dirname, '../UserImage/', req.file.filename)),
                            contentType: 'image/jpg'
                        }


                    }).save((errorMongodb, data) => {

                        if (errorMongodb) {

                            return res.render('errorEmailPage', { err: "Email is alredy in use ,please try different" })
                        }

                        else {
                            console.log(req.file);
                            res.redirect(`/routes/showdata/${req.body.email}/${req.file.filename}/?${bcryptjs.hashSync(req.body.email, 10)}`)

                        }

                    })

                }



            }




        })




    })



//showdata in table 

router.get('/showdata/:email/:path', (req, res) => {
    console.log(req.params.path);
    users.findOne({ email: req.params.email }, (mongoError, isExistData) => {

        if (mongoError) {
            return res.send(mongoError)
        }
        else {
            if (isExistData) {
                // console.log(req.params.id);
                return res.render('resume', {
                    name: isExistData.fname + " " + isExistData.lname,

                    fathername: isExistData.fathername,

                    dob: isExistData.dob,

                    email: isExistData.email,

                    education: isExistData.education,

                    skills: isExistData.skills,

                    address: isExistData.address

                    , state: isExistData.state,

                    city: isExistData.city,

                    zip: isExistData.zip,
                    // img:req.params.id
                    urlimage: req.params.path



                })

            } else {
                return res.send('<h1>This email id does not exist   (hacker) !</h1> <br> <a href="/">Home</a>')
            }



        }



    })


})



// for deleteing the resume from database

router.get('/:email/:name/deletemyresume/:path', (req, res) => {//this will show pop for confirmation of deleting data

    res.render('yesno', {
        message: "Are you sure Want to delete you resume ?",
        btn_one: "Yes"
        , btn_two: "No",
        jsonlink: `/routes/${req.params.email}/${req.params.name}/${req.params.path}/?${bcryptjs.hashSync("delete", 10)}`,
        jsonlinktwo: false
    })

})


router.get('/:email/:name/:path', (req, res) => {

    users.findOneAndRemove({ email: req.params.email }, (DeleteError, deleted) => {
        if (DeleteError) {
            return res.send(DeleteError)
        } else {
            if (deleted) {
                return res.render('yesno', {
                    message: "Resume deleted successfully !!",
                    btn_one: "Home"
                    , btn_two: "Create New",
                    jsonlink: `/`,
                    jsonlinktwo: "/resumemaking"
                })
            }
            else {
                return res.render('yesno', {
                    message: "Resume already has been deleted !",
                    btn_one: "Create New"
                    , btn_two: "Home",
                    jsonlink: `/resumemaking`,
                    jsonlinktwo: "/"
                })
            }


        }



    })

})

// complted deleting operations
//start updating list
router.get('/update/:email', (req, res) => {
    users.findOne({ email: req.params.email }, (errorUpdate, data) => {

        if (errorUpdate) {
            return res.render('yesno', {
                message: "Sorry there is database error",

                btn_one: "Home", 

                btn_two: " Go Back"
                , jsonlink: `/`
                , jsonlinktwo: false
            })
        }
        else {

            if (data) {
                console.log(data.skills, data.state, data.address);
                return res.render('update', {
                    fname: data.fname,
                    lname: data.lname,
                    fathername: data.fathername,
                    education: data.education,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zip: data.zip,
                    dob: data.dob,
                    skills: data.skills,
                    email: data.email,


                }

                )
            } else {

                return res.render('yesno', {
                    message: "Unable to Update Plese try again latar..",

                    btn_one: "Home",

                    btn_two: " Go Back"
                    , jsonlink: `/`
                    , jsonlinktwo: false
                })
            }
        }


    })

})

router.post('/updatingData/:email/confirmation', uploads.single('image'), (req, res) => {

    res.render('yesno', {
        message: "Do you really want to update your resume..",

        btn_one: "Yes",

        btn_two: " No"
        , jsonlink: `/routes/${req.params.email}/${req.body.fname}/${req.body.lname}/${req.body.email}/${req.body.skills}/${req.body.address}/${req.body.city}/${req.body.zip}/${req.body.dob}/${req.body.fathername}/${req.body.education
            }/${req.body.state}/${req.file.filename}/updatingSelectedData/?${bcryptjs.hashSync('update', 10)}`
        , jsonlinktwo: false

    })

})




router.get('/:email/:fname/:lname/:emailupd/:skills/:address/:city/:zip/:dob/:fathername/:education/:state/:imgname/updatingSelectedData', uploads.single('image'), (req, res) => {

// return res.send(req.params.imgname)//image name is here it was for the debugging

        users.find(
               {
                     email:req.params.emailupd

                }  ,( error,MathedData)=>
                {   
                        if(error)

                        {
                                return res.send(error)

                        }else
                        {
                            if((MathedData.length) < 1 || (req.params.email === req.params.emailupd))
                            {
                                       var firstName =req.params.fname.toUpperCase()
                                    //now save the updated data insise the database...
                                    users.updateOne({email:req.params.email},{  
                                    
                                            fname:firstName,
                                            lname:req.params.lname.toUpperCase(),
                                            email:req.params.emailupd.replace(/\s+/g, ''),
                                            fathername:req.params.fathername.toUpperCase(),
                                            address:req.params.address,
                                            city:req.params.city.toUpperCase().replace(/\s+/g, ''),
                                            state:req.params.state,
                                            zip:req.params.zip,
                                            dob:req.params.dob,
                                            skills:req.params.skills,
                                            education:req.params.education,
                                            imgpath:req.params.imgname,
                                            img:{
                                                data: fs.readFileSync(path.join(__dirname, '../UserImage/', req.params.imgname)),
                                                contentType: 'image/jpg'
                                            }
                                    

                                    }, (error,UpdatedData)=>{

                                        if(error)
                                        {
                                            return res.send(error)  //it will show if any mongodb database Error...

                                        }


                                        else{
                                           
                                                //if everything will be fine then we will show them a confirmmation window
                                                return res.render('yesno', {
                                                    message: "Resume Updated Successfully ..",
                                
                                                    btn_one: "Show ",
                                
                                                    btn_two: " Home"
                                                    , jsonlink: `/routes/${req.params.emailupd}/User/${req.params.imgname}/ShowUpdatedForm/?${bcryptjs.hashSync("update",10)}`
                                                    , jsonlinktwo: '/'
                                                })



                                                }

                                    })


                            }
                            else


                                {
                                   //updated email id has been not unique then we will show them message....
                                   return res.render('usedemail', {
                                    message: "Email is has already been used   Please try another one",
            
                                    linkone:'/'
                                    ,btnone:"Home"
                                })
                                }



                        }
                
                
                
                
                 })

})


//search wala option isme bhi hai

  router.get('/:email/User/:filename/ShowUpdatedForm',(req,res)=>{


        users.findOne({email:req.params.email},{img:0},(error,data)=>{
if(error)
{
    return res.send(error)

}
else

{
// now we will show the updated data


if(data!=null)
{
    return res.render('resume',{
        name : data.fname + '  ' + data.lname,
    
        fathername: data.fathername,
    
        dob: data.dob,
    
        email: data.email,
    
        education: data.education,
    
        skills: data.skills,
    
        address: data.address
    
        , state: data.state,
    
        city: data.city,
    
        zip: data.zip,
    
        urlimage:req.params.filename

    })


}


else
{
    return res.render('yesno', {
        message: "We are facing Some server problem ,Please try latar !",
    
        btn_one: "Home",
    
        btn_two: "Serch "
        , jsonlink: `/`
        , jsonlinktwo: false
    })

}

  
}

        })

})

// updating work finish here


//searching work start here...

router.get('/search/data',(req,res)=>{
        //it will show the search form only
 return res.sendFile(path.join(__dirname,'../html','search.html'))
        
})

router.post('/find/data',(req,res)=>{

    //cheking with help of what data we are searching the resumes
    var myObject ={}
    let givendata =req.body.data.toUpperCase()

    if(req.body.select == 'Email')
    {
         myObject ={email:req.body.data}

    }

    else if(req.body.select == 'Name')
    {
         myObject ={fname:givendata}

    }
    else if(req.body.select == 'City')
    {
         myObject ={city:givendata}

    }
    else
    {
         myObject ={}
    }

//now we will show the out put
// console.log(myObject);
users.find(myObject  ,  (findingError,result)=>

{
 
    if(findingError)
    {
        return res.send(findingError)

    }
    else
    {
       
        if(result.length == 0) //find will return array if no matched document it will return blank Array in result

        {
            return res.render('yesno', {
                message: `Sorry No Matched For This ${req.body.select}..`,

                btn_one: "Create ",

                btn_two: " Back"

                , jsonlink: `/resumemaking`

                , jsonlinktwo:false
            })

        }

        else
        {
                return res.render('show',{
                    result:result
                })

        }

    }
 
})
 

})

//searchig works ends here

//about page starts

router.get('/about',(req,res)=>{
 
    return res.sendFile(path.join(__dirname,'../html','about.html'))

})

module.exports = router;

//end of this project at 1/11/2020
// we can make this more error less afyer editing the editing resume.pug coz imag loded in that from the location not from the database



// AGAR FIND KARNE PE NHI AA RHA TO WHITE SPACE KA LOCH HAI
/*////////////////////////////////////////////////*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/