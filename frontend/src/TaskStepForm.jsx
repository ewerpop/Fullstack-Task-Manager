import Button from "./Button"
import { useState } from "react"

export default function TaskStepForm({addStep, id}) {
    const [value, setValue] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        addStep({action: 'Add step', id: id, label: value})
        setValue('')
    }
    const onChange = (e) => {
        setValue(e.target.value)
    }

    return (
        <form onSubmit={onSubmit} className="step-form">
            <input type="text" value={value} onChange={onChange} placeholder="Add new step"/>
            <Button icon='check' label='Add'></Button>
        </form>
    )
}