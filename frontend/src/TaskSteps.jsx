import TaskStepForm from "./TaskStepForm"
import Button from "./Button"
import DropArea from "./DropArea"

export default function TaskSteps({ task, state, postData, moveStep, steps, addStep, deleteStep, doneStep, id, setActiveStep }) {

    return (
        <div>
            <ul>
                <li className="step">
                    <DropArea onDrop={() => moveStep({ action: 'Move step', index: 0, id: id })} />
                </li>

                {steps.map((e) => {
                    return (
                        <div key={e.num}>

                            <li className="step" onDragStart={() => setActiveStep(e.index)} draggable>
                                {e.done ?
                                    <input id={e.num} onChange={() => {
                                        doneStep({ action: 'Done step', id: id, num: e.num, done: e.done })
                                        postData({ action: 'Done step', id: id, num: e.num, done: e.done })
                                    }} name={e.num} type="checkbox" checked /> : <input name={e.num} type="checkbox" onChange={() => {
                                        doneStep({ action: 'Done step', id: id, num: e.num, done: e.done })
                                        postData({ action: 'Done step', id: id, num: e.num, done: e.done })
                                    }} />
                                }
                                {e.done ?
                                    <del><label className="step-label" htmlFor={e.num}>{e.label}</label></del> : <label className="step-label" htmlFor={e.num}>{e.label}</label>
                                }


                                <form onSubmit={(ev) => {
                                    ev.preventDefault()
                                    deleteStep({ action: "Delete step", id: id, num: e.num })
                                    postData({ action: 'Delete step', num: e.num })
                                }}><Button icon='trash' label="Delete"></Button></form>

                            </li>
                            <li className="card">
                                <DropArea onDrop={() => moveStep({ action: 'Move step', index: e.index + 1, id: id })} />
                            </li>
                        </div>
                    )
                })}
            </ul>
            <TaskStepForm task={task} postData={postData} addStep={addStep} state={state} id={id} />
        </div>
    )
}