const express = require('express')
const mongoose = require("mongoose")
const ejs = require('ejs')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
app.use("/",express.static("./public"));
app.set("view engine","ejs")
const TodoTask = require("./models/ToDoTask");
// Urlencoded will allow us to extract the data from the form by adding her to the body property of the request.
// mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
app.use(express.urlencoded({extended: true}));
app.get('/',async (req,res) => {
    const tasks = await TodoTask.find({});
    res.render('todo.ejs',{todoTasks:tasks})
})

app.post('/',async (req,res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try{
        await todoTask.save();
        res.redirect('/');
    }
    catch(err)
    {
        res.redirect('/');
    }
});

//UPDATE
app
.route("/edit/:id")
.get(async (req, res) => {
const id = req.params.id;
const tasks = await TodoTask.find({});
    res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id })
})
.post(async (req, res) => {
const id = req.params.id;
try{
    await TodoTask.findByIdAndUpdate(id, { content: req.body.content })
    res.redirect("/");
}
catch(err){
    return res.send(500, err);
}
});

//DELETE
app.route("/remove/:id").get(async (req, res) => {
        const id = req.params.id;
        try{
            await TodoTask.findByIdAndRemove(id);
            res.redirect("/");
        }
        catch(err){
            console.log(err)
            res.send(500)
        }
        
});

//connection to db


app.listen(3000,() => console.log("Server is up and running :)"))
