// const config = require("./config.js");
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const { getTasks, createTask, updateTask, deleteTask, getTask } = require('./core/controller.js');
app.use(bodyParser.json());
app.use(cors({
  origin: "*"
}));


process.on('unhandledRejection', err => {
    console.log(err)
});	

app.get('/', async function (req, res) {
   
  res.status(200).json({ ok: "Tracker-App" })  

}); 	

app.get('/tasks', getTasks)
app.get('/tasks/:taskId', getTask)
app.post('/tasks', createTask)
app.patch('/tasks/:taskId', updateTask)
app.delete('/tasks/:taskId', deleteTask)


module.exports = app;


// app.listen(process.env.PORT || 5000, function () {
//     console.log('Listening on port 80..');
// });

