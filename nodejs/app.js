var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

var mongoDB = 'mongodb://127.0.0.1/users';
mongoose.connect(mongoDB,{ useNewUrlParser: true, useUnifiedTopology: true  });


var Users = require('./modules/user.js');

//SHOW ALL USERS
app.get('/', (req, res) => {
  Users.find({}, function(err, users){
    if(err){
      console.log(err);
    }else{
      res.render('index.ejs', { 
        title: "User details",
        data: users
      });
    }
  });
});

//CREATE USER FORM GET 
app.get('/create',  (req, res)=>{
  res.render('insert.ejs', {
    title:"Create User"
  });
});

//CREATE USER POST 
app.post('/insert', (req, res)=>{
  var user = new Users({
    name: req.body.name,
    surname: req.body.surname
  });

  user.save(function(err, ){
    if(err){
      console.log(err);
      return err;
    }
  });

  res.redirect('/');
});


//UPDATE USER FORM GET 
app.get('/edit/:id',  (req, res)=>{
  Users.findById(req.params.id, function(err, users){
    if(err){
      console.log(err);
    }else{
      res.render('update.ejs', { 
        title: 'Update Users', 
        id: users["_id"],
        name: users["name"] ,
        surname: users["surname"]                   
      });
    }
  });
});

//UPDATE USER POST
app.post('/update/:id', function(req, res){
  Users.findById(req.params.id, function(err, users){
    if(err){
      console.log(err);
    }else{
      users.name = req.body.name;
      users.surname = req.body.surname;
      users.save(function(err, ){
        if(err){
          console.log(err);
          return err;
        }
      });
      res.redirect('/');
    }
  });
});

//DELETE USER GET FORM 
app.get('/delete/:id', function(req, res){
  res.render('delete', {
    title: 'Delete Users', 
    id: req.params.id
  });
});

//DELETE USER POST
app.post('/remove/:id', function(req, res){
  Users.findByIdAndRemove(req.params.id, function(err){
    if (err) throw err;
    res.redirect('/');
  });
});


app.listen(3000);


