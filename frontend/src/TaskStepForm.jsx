import Button from "./Button"
import { useState } from "react"

export default function TaskStepForm({ task, postData, addStep, id, state }) {
    const [value, setValue] = useState('')

    const onSubmit = (e) => {
        const idx = task.steps.length * 1000
        e.preventDefault()
        postData({
            action: 'Add step',
            id: id,
            label: value,
            step_index: idx
        }, { action: 'Add step', id: id, label: value, step_index: idx, target: 'step' })
        setValue('')
    }   
    const onChange = (e) => {
        setValue(e.target.value)
    }

    return (
        <form onSubmit={onSubmit} className="step-form">
            <input type="text" value={value} onChange={onChange} placeholder="Add new step" />
            <Button icon='check' label='Add'></Button>
        </form>
    )
}