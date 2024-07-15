import ButtonCard from "./ButtonCard"
import { useState } from 'react'

export default function Registration() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const signUp = async () => {
        let res = await fetch('todo-items',{ 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({data: {action: 'Add user', username: username, password: password}})
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <>
            <div className="card">
                <header className="card-header">
                    <h3>Task Manager</h3>
                </header>
                <main>
                    <form onSubmit={onSubmit} style={{flexDirection: 'column'}} className="card-title-form">
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            style={{width: '100%'}}
                            value={username}
                            placeholder="Enter your username here"
                            name="username"
                            className="card-title card-title-input" />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            style={{width: '100%'}}
                            value={password}
                            placeholder="Enter your password here"
                            name="password"
                            className="card-title card-title-input" />
                        <div className="logIn-buttons">
                            <ButtonCard width={'45%'} label={'Log In'} />
                            <ButtonCard width={'45%'} label={'Sign Up'} />
                        </div>
                    </form>

                </main>
            </div>
        </>
    )
}