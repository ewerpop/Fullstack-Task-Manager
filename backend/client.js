let sqlite3

module.exports = {
    db: null,
    init() {
        try {
            sqlite3 = require('sqlite3').verbose()
        } catch (e) {
            return e
        }
    },
    query(sql) {
        return new Promise((res, rej) => {
            this.db.all(sql, [], function (e, result) {
                if (e) rej(e)
                res(result)
            })
        })
    },
    select(sql) {
        return new Promise((res, rej) => {
            this.db.all(sql, [], function (e, data) {
                if (e) rej(e)
                res(data)
            })
        })
    },
    connect() {
        return new Promise((res, rej) => {
            this.db = new sqlite3.Database('./tasks.db', (err) => {
                if (err) {
                    rej(err)
                } else {
                    res('ok')
                }
            })
        })
    },
    createUsers() {
        return new Promise((res, rej) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT`)
        })
    },
    createTasks() {
        return new Promise((res, rej) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                task_index INTEGER
            )`, function (e) {
                if (e) {
                    rej(e)
                } else {
                    res('okay')
                }
            });
        })
    },
    createSteps() {
        return new Promise((res, rej) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS steps(
                task_id INTEGER,
                step_id INTEGER PRIMARY KEY AUTOINCREMENT,
                label TEXT,
                done BOOLEAN,
                step_index INTEGER,
                FOREIGN KEY(task_id) REFERENCES tasks(id)
            )`, function (e) {
                if (e) {
                    rej(e)
                } else {
                    res('okay')
                }
            })
        })
    },
    run(values, sql) {
        return new Promise((res, rej) => {
            this.db.run(sql, values, function (e) {
                if (e) {
                    rej(e)
                } res(this.lastID)
            })
        })
    }


}