import Button from "./Button"
import { useState } from "react"

export default function TaskAdd({addTask}) {
    const [title, setTitle] = useState('')
    const onChange = (e) => {
        setTitle(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        addTask({title: title, action: 'Add'})
        setTitle('')
    }

    return (
        <li className="card">
        <header className="card-header card-header-new">
          <form onSubmit={ onSubmit} className="card-title-form">
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