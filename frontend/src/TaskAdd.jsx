import Button from "./Button"
import { useState } from "react"

export default function TaskAdd({addTask, state, postData}) {
    const [title, setTitle] = useState('')
    const onChange = (e) => {
        setTitle(e.target.value)
    }

    // async function postData(obj) {
    //   let res = await fetch('/todo-items', {
    //     method: 'POST', 
    //     headers: {
    //       'Content-Type': 'application/json;charset=utf-8',
    //       'Access-Control-Allow-Origin': '*'
    //     },
    //     body: JSON.stringify()
    //   })
    // }
    const onSubmit = (e) => {
      const id = Date.now()
        e.preventDefault()
        const idx = state.length
        addTask({title: title, action: 'Add', id: id, task_index: idx})
        postData({
          action: 'Add task',
          title: title,
          index: idx,
          id: id,
        })
        setTitle('')
    }

    return (
        <li className="card">
        <header className="card-header card-header-new">
          <form onSubmit={onSubmit} className="card-title-form">
            <input
              value={title}
              className="card-title card-title-input"
              placeholder="Add new task"
              name="title"
              onChange={onChange}
            />
            <Button icon='plus' label='Add task' />
          </form>
        </header>
      </li>
    )
}