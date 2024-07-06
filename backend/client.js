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
    createTasks() {
        return new Promise((res, rej) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY,
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
                num INTEGER PRIMARY KEY,
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
    insertSteps(task_id, label, step_index, num) {
        return new Promise((res, rej) => {
            this.db.run(`INSERT INTO steps (task_id, num, label, done, step_index) VALUES (?, ?, ?, ?, ?)`, [task_id, num, label, false, step_index], function (err) {
                if (err) {
                    rej(err)
                }
                res(200)
            });
        })
    },
    insertTask(title, task_index, id) {
        return new Promise((res, rej) => {
            this.db.run(`INSERT INTO tasks (title, task_index, id) VALUES (?, ?, ?)`, [title, task_index, id], function (e){
                if (e) {
                    rej(e)
                } else {
                    res('Going to be alright')
                }
            })
        })
    },
    deleteTask(id) {
        return new Promise((res, rej) => {
            this.db.run(`DELETE FROM tasks WHERE id=?`, id,  function(e) {
                if(e) {
                    rej(e)
                } else {
                    res(200)
                }
            })
            
        })
    },
    run(values, sql) {
        return new Promise((res, rej) => {
            this.db.run(sql, values, function(e) {
                if (e) {
                    rej(e)
                } res(200)
            })
        })
    }


}