import { useState } from "react";

export default function TaskHeader({postData, task, isEditable, setEditable, editTask}) {
  const [title, setTitle] = useState(task.title)

  const onChange = (e) => {
    setTitle(e.target.value)
  }

  const handleEditTask = (e) => {
    e.preventDefault()
    editTask({id: task.id, title: title, action: 'Edit'})
    postData({action: 'Edit task', title: title, id: task.id})
    setEditable(false)
  }
  if(isEditable) {
    return (
      <header className="card-header">
        <form className="card-title-form" onSubmit={handleEditTask}>
          <input
            className="card-title-input"
            defaultValue={title}
            value={title}
            onChange={onChange}
            name="title"
          />
          <button className="icon-button">
            <img src="/icons/check.svg" alt="Edit step" />
          </button>
        </form>
      </header>
    );

  }

    return (
        <header className="card-header">
          <p className="card-title">{title}</p>
        </header>
    )
}