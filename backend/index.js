const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const client = require('./client')

async function createDB() {
    try {
        await client.init()
        await client.connect()
        await client.createTasks()
        await client.createSteps()
    } catch (e) {
        console.error(e)
    }
}

createDB()

// let db = new sqlite3.Database('./tasks.db', (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Connected to the tasks database.');
// });

// db.run(`CREATE TABLE IF NOT EXISTS tasks (
//     id INTEGER PRIMARY KEY,
//     title TEXT,
//     task_index INTEGER
// )`);

// db.run(`CREATE TABLE IF NOT EXISTS steps(
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

app.get('/todo-items', async (req, res) => {
    let result = await client.query(`SELECT * FROM tasks LEFT JOIN steps ON tasks.id = steps.task_id ORDER BY tasks.id`)
    console.log(result)
    res.json(JSON.stringify({data: []}))
})


// const addTask =  (title, index, id) => {
//     return new Promise((resolve, reject) => {
//         db.run(`INSERT INTO tasks(title, task_index, id)
//         VALUES(?, ?, ?)`, [title, index, id], function(e) {
//             if(e) reject(e)
//             resolve(id)
//         }
//     )
//     })
    
// }

app.post('/todo-items', async (req, res) => {
    let obj = req.body.data
    try {
        switch (obj.action) {
            case 'Add task':
                await client.run([obj.title, obj.index, obj.id], `INSERT INTO tasks (title, task_index, id) VALUES (?, ?, ?)`)
                break
            case 'Add step':
                await client.run([obj.id, obj.num, obj.label, false, obj.step_index], `INSERT INTO steps (task_id, num, label, done, step_index) VALUES (?, ?, ?, ?, ?)`)
                break
            case 'Delete task':
                await client.run(obj.id, `DELETE FROM tasks WHERE id=?`)
                await client.run(obj.id, 'DELETE FROM steps WHERE task_id=?')
                break
            case 'Delete step':
                await client.run(obj.num, `DELETE FROM steps WHERE num=?`)
                break
            case 'Edit task':
                await client.run([obj.title, obj.id], `UPDATE tasks
                    SET title = ?
                    WHERE id=?`)
                break
            case 'Done step':
                await client.run([!obj.done, obj.num], `UPDATE steps
                    SET done = ?
                    WHERE num=?`)
                break
        }
        res.send("ok")
    } catch (e) {
        console.error(e)
        res.send(e)
    }
    
})

app.put('/todo-items', (req, res) => {
    res.send(req.body)
    newItems.push(req.body)
    console.log(newItems)
    myEmitter.emit('itemsUpdated')
})

myEmitter.on('itemsUpdated', () => {
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