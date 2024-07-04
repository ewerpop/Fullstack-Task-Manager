import TaskHeader from "./TaskHeader"
import { useState, useEffect } from "react";
import TaskSteps from "./TaskSteps";
import Button from "./Button";

export default function Task({ moveStep, setActiveStep, task, editTask, deleteTask, addStep, deleteStep, doneStep, index, setActiveCard, post }) {
  const defaultStyle = {
    alignItems: 'left',
    background: "blue",
    height: '5px',
    width: `0%`
  }

  const [isEditable, setEditable] = useState(false)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [style, setStyle] = useState(defaultStyle)

  useEffect(() => {
    const done = task.steps.filter((e) => e.done === true).length;
    const all = task.steps.length;
    let progress;
    if (all) {
      progress = (done * 100) / all
    } else {
      progress = 0
    }


    setProgress(Math.round(progress));
    setStyle({ ...style, width: String(progress) + '%' })
  }, [task.steps])


  return (
    <li className="card" draggable={!visible} onDragStart={() => setActiveCard(index)} onDragEnd={() => setActiveCard(null)}>
      <ul className="taskHead">
        <li>
          <form onSubmit={(e) => {
            e.preventDefault()
            setVisible((v) => v = !v)
          }}><Button icon='caret' label='caret' /></form>
        </li>
        <li>
          <TaskHeader task={task} isEditable={isEditable} setEditable={setEditable} editTask={editTask} />
        </li>
        <li>
          {progress}%
        </li>
      </ul>

      <ul className="card-controls">
        {isEditable || <li>
          <button className="card-control" onClick={() => setEditable(true)}>Edit</button>
        </li>}
        <li>
          <button className="card-control" onClick={() => deleteTask({ id: task.id, action: 'Delete' })}>Delete</button>
        </li>
      </ul>
      {visible ? <TaskSteps moveStep={moveStep} setActiveStep={setActiveStep} id={task.id} steps={task.steps} addStep={addStep} deleteStep={deleteStep} doneStep={doneStep} /> : null}
      <div style={style}></div>

    </li>
  )
}