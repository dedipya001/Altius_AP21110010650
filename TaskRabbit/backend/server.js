// using express and Mongo DB tobuild the backend for the app
//will use react to make the frontend

const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs/dist/bcrypt')

const app =express()
const port = 5000

app.use(cors())
app.use(bodyParser.json())

const MONGO_URI = 'mongodb+srv://dedipyagoswami001:dedipya123@cluster0.9nlhozk.mongodb.net/authen?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI,{useNewURLParser:true,useUnifiedTopology:true})
.then(()=>console.log("Database Connected"))
.catch(err=>console.log("Error connecting to DB", err));

// Schemas:  

const userSchema = new mongoose.Schema({
    username: String,
    email : {type: String, unique: true},
    password: String,
    image:String,
    bio: String
});
const taskSchema = new mongoose.Schema({
    name: String
});



// defining the models:

const User = mongoose.model('User',userSchema);
const Task = mongoose.model('Task', taskSchema);


const upload = multer({dest: 'uploads/'});  // using multer to store the images



// Defining the register and login endpoints , used bcryptjs for hashing
// used jwt tokens for 2 hr validations

//will be storing  the user token in local Storage of browser
app.post('/api/register', upload.single('image'), async(req,res)=> {
    try{
        const{  username, email , password } = req.body;
        const image = req.file?req.file.path : "";
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser= new User({ username, email, password:hashedPassword, image})
        await newUser.save();
        res.status(201).send("User Registered");
    } catch(err) {
        console.error("Error Registering the usser:', err");
        res.status(500).send('Error Registering the  user');
    }
});


app.post('/api/login', async(req,res)=>{
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (user && await bcrypt.compare(password,user.password)){
            const token = jwt.sign({ email : user.email} , 'secret_key', {expiresIn:'2hr'});
            res.json({token});
        }
        else{
            res.status(401).send('Invalid Credentials');
        }

    }
    catch(err){
        console.error('Error logging the User', err);
        res.status(500).send('Error logging in');
    }
});



// for fetchingt the profile
app.get('/api/profile', async(req,res)=> {
    try{
        const user = await User.findOne();
        if (user){
            res.join(user);
        }
        else{
            res.status(404).send('No User Found');
        }
    }
    catch(err){
        console.error("Error Fetching the User Profile ", err)
        res.status(500).send('No user Found');
    }
});


// for creating a profile used username, profile pic and bio


app.post('/api/profile',async(req,res)=>{
    try{
        const {bio} = req.body;
        const user = await User.findOne();
        if (user){
            user.bio = bio;
            await user.save();
            res.send("Profile is Updated");
        }
        else{
            res.status(404).send("No user found for updation")
        }
    }
    catch(err){
        console.error('Error Updating Profile',err);
        res.status(500).send("Error Updating the Profile");
    }
});



// endppoint for uploading the images and stroing in uploads folder
app.post('/api/upload-image',upload.single('image'), async(req,res)=>{
    try{
        const file= req.file;
        if (file){
            const ext = path.extname(file.originalname);
            const newPath=  `uploads/${file.filename}${ext}`;
            fs.renameSync(file.path,newPath);
            const user=await  User.findOne();
            if(user){
                user.image = new Path;
                await user.save();
            }
            res.send("Image is uploaded");
        }
        else{
            res.status(400).send("No file uploaded");
        }

    }
    catch(err){
        console.error("Error Uploadingthe Image",err);
        res.status(500).send("Error Uploading the Image");

    }
});


//Task Management api endpoints
// for creating updating and deleting the tasks, used post for creating , deltete for deleting and put for updations and get toview all tasks

app.post('/api/tasks', async(req,res)=>{
    try{
        const {name} = req.body;
        const newTask = new Task({name});
        await newTask.save();
        res.status(201).json(newTask);

    }
    catch(err){
        console.error("Error adding the task",err);
        res.status(500).send("Eror adding the task")
    }
});


app.get('/api/tasks',async(req,res)=>{
    try{
        const tasks = await Task.find();
        res.json(tasks);
    }
    catch(err){
        console.error("Error Fetching the task");
        res.status(500).send("Error Fetching the tasks");
    }
});


app.delete('/api/tasks/:id', async(req,res)=>{
    try{
        await Task.findByIdAndDelete(req.params.id);
        res.send("Task is Deleted");
    }catch(err){
        console.error("Task cannot be deleted");
        res.status(500).send("Error Deleting the Task")
    }
});


app.put('/api/tasks/:id', async (req,res)=> {
    const{name} = req.body;
    const {id} = req.params;
    const task = await Task.findById(id);

    if (task){
        task.name = name;
        await task.save();
        res.json(task);
    }
    else{
        res.status(404).send("Task not Found");
    }
});





app.listen(port,()=>{
    console.log(`Server running on ${port}`);
});