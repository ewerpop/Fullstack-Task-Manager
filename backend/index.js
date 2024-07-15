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

const PORT = process.env.PORT || 3010
const app = express()

app.use(function (req, res, next) {
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
    let result = await client.query(`SELECT * FROM tasks LEFT JOIN steps ON tasks.id = steps.task_id ORDER BY tasks.id, step_index`)
    let data = []
    let lastId = 0
    result.forEach((el) => {
        if (el.id !== lastId) {
            data.push({ id: el.id, title: el.title, index: el.task_index, steps: [{ num: el.step_id, done: el.done, label: el.label, index: el.step_index }] })
            lastId = el.id
        } else {
            data[data.length - 1].steps.push({ num: el.step_id, label: el.label, done: el.done, index: el.step_index })
        }
    })
    console.log(JSON.stringify({ data }))
    res.json(JSON.stringify({ data }))
})

app.post('/todo-items', async (req, res) => {
    let obj = req.body.data
    let id = 20000000;
    try {
        switch (obj.action) {
            case 'Add task':
                id = await client.run([obj.title, obj.index], `INSERT INTO tasks (title, task_index) VALUES (?, ?) RETURNING *`)
                break
            case 'Add step':
                id = await client.run([obj.id, obj.label, false, obj.step_index], `INSERT INTO steps (task_id, label, done, step_index) VALUES (?, ?, ?, ?)`)
                console.log(id)
                break
            case 'Delete task':
                await client.run(obj.id, `DELETE FROM tasks WHERE id=?`)
                await client.run(obj.id, 'DELETE FROM steps WHERE task_id=?')
                break
            case 'Delete step':
                await client.run(obj.num, `DELETE FROM steps WHERE step_id=?`)
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
            case 'Move task':
                console.log(obj.task_index)
                await client.run([obj.task_index, obj.id], `UPDATE tasks
                    SET task_index = ?
                    WHERE id=?`)
                break
            case 'Move step':
                await client.run([obj.step_index, obj.num], `UPDATE steps
                    SET step_index = ?
                    WHERE id=?`)
                break
            case 'Special move step':
                await client.run([obj.step_index1, obj.num1], `UPDATE steps
                    SET step_index = ?
                    WHERE id=?`)
                await client.run([obj.step_index2, obj.num2], `UPDATE steps
                    SET step_index = ?
                    WHERE id=?`)
            case 'Special move task':
                await client.run([obj.task_index1, obj.id1], `UPDATE tasks
                    SET task_index = ?
                    WHERE id=?`)
                await client.run([obj.task_index2, obj.id2], `UPDATE tasks
                    SET task_index = ?
                    WHERE id=?`)
        }
        res.json(JSON.stringify({ data: {id}}))
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