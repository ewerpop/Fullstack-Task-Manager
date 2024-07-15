import Button from "./Button"
import { useState } from "react"

export default function TaskAdd({ addTask, state, postData }) {
  const [title, setTitle] = useState('')
  const onChange = (e) => {
    setTitle(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const idx = state.length * 1000
    postData({
      action: 'Add task',
      title: title,
      index: idx,
    }, {action: 'Add', title: title, index: idx, target: 'task'})
    // await addTask({action: 'Add', title: title, id: req, index: idx})
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