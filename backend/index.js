const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// let db = new sqlite3.Database('./tasks.db', (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Connected to the tasks database.');
// });

db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT,
    task_index INTEGER
)`);

// db.run(`CREATE TABLE IF NOT steps({"data":[]}
//     id INTEGER PRIMARY KEY,
//     task_id INTEGER,
//     num INTEGER,
//     title TEXT,
//     done BOOLEAN,
//     step_index INTEGER,
//     FOREIGN KEY(task_id) REFERENCES tasks(id)
// )`)

const PORT = process.env.PORT || 3010
const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3010"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
})
app.use(express.urlencoded());
app.use(express.json());

let newItems = []

app.get('/todo-items', (req, res) => {
    res.json(fs.readFileSync('./todo-items.json', 'utf8'))
})

app.put('/todo-items', (req, res) => {
    res.send(req.body)
    newItems.push(req.body)
    console.log(newItems)
    myEmitter.emit('itemsUpdated')
})

myEmitter.on('itemsUpdated', () => {
    //console.log(newItems[0])
    fs.writeFileSync('./todo-items.json', JSON.stringify(newItems[0]))
    newItems.splice(0, newItems.length)
})

app.listen(PORT, () => {
    console.log(`Server listening on the ${PORT} port`)
})

// db.close((err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Closed the database connection.');
//   });