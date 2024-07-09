import Button from "./Button"
import { useState } from "react"

export default function TaskStepForm({ task, postData, addStep, id, state }) {
    const [value, setValue] = useState('')

    const onSubmit = (e) => {
        const idx = task.steps.length
        console.log(idx)
        const num = Date.now()
        e.preventDefault()
        addStep({ action: 'Add step', id: id, label: value, num: num, step_index: idx })
        postData({
            action: 'Add step',
            id: id,
            label: value,
            num: num,
            step_index: idx * 1000
        })
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