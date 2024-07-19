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
    query(sql, values) {
        return new Promise((res, rej) => {
            this.db.all(sql, values, function (e, result) {
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
    search(sql, value) {
        return new Promise((res, rej) => {
            this.db.run(sql, value, function (e, data) {
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
            this.db.run(`CREATE TABLE IF NOT EXISTS users( 
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT)`, function(e) {
                    if (e) {
                        rej(e)
                    } else {
                       res('okay') 
                    }
                    
                })
        })
    },
    createTasks() {
        return new Promise((res, rej) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS tasks (
                user_id INTEGER,
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                task_index INTEGER,
                FOREIGN KEY(user_id) REFERENCES users(id)
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