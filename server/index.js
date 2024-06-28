//Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//create an instance of express
const app = express();
app.use(express.json())
app.use(cors())
//sample in-memory storage
//let todos = [];

//Connecting of mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
    console.log('DB Connected')
})
.catch((err) => {
    console.log(err)
})

//Creating Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//Creating Model
const todoModel = mongoose.model('Todo', todoSchema);

//Define a route
app.get('/',(req, res) => {
    res.send("Hello World")
})

//create a new todo item
app.post('/todos', async (req, res) => {
    const {title, description} =  req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    try{
        const newTodo = new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo)
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : error.message})
    }
})

//Get all items from the list
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

//Update the todo
app.put('/todos/:id', async (req, res) => {
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updateTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description},
            { new: true }
        )
        if(!updateTodo){
            return res.status(404).json({message: "Todo Not Found"})
        }
        res.json(updateTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

//Delete a todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

//Start the server
const port = 8000;
app.listen(port, () => {
    console.log("server is listening to port" + "" + port);
})