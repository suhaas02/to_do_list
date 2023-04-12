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
app.get('/',(req,res) => {
    TodoTask.find({},(err,tasks) => {
        res.render("todo.ejs",{todoTasks: tasks});
    })
    
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
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

//DELETE
app.route("/remove/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//connection to db


app.listen(3000,() => console.log("Server is up and running :)"))
