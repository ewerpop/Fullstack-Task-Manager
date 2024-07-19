import { Link } from "react-router-dom"
import ButtonCard from "./ButtonCard"
import { useState } from 'react'

export default function Registration() {
    const [isLog, setIsLog] = useState(false)
    const [success, setSuccess] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const signIn = async () => {
        fetch('/todo-items/sign', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({data: {username: username, password: password}})
        })
        .then((res) => res.json())
        .then((result) => {
            if(result.message === 'This user doesn`t exists') {
                setSuccess(false)
                setIsLog(false)
                localStorage.setItem('auth', false)
            } else if (result.message === 'Wrong password') {
                setSuccess(false)
                setIsLog(false)
                localStorage.setItem('auth', false)
            } else if (result.message === 'Okay') {
                setSuccess(true)
                setIsLog(true)
                localStorage.setItem('auth', true)
                localStorage.setItem('user_id', result.id)
            }
        })
    }

    const signUp = async () => {
        fetch('/todo-items/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ data: { username: username, password: password } })
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.message === 'Success') {
                    setSuccess(true)
                    setIsLog(true)
                    localStorage.setItem('auth', true)
                    localStorage.setItem('user_id', result.id)
                } else {
                    setSuccess(false)
                    setIsLog(false)
                    localStorage.setItem('auth', false)
                }
            })
    }
    const onSubmitSignIn = (e) => {
        e.preventDefault()
        signIn()
    }

    const onSubmitSignUp = (e) => {
        e.preventDefault()
        signUp()
    }
    return (
        <>
            <div className="card">
                <header className="card-header">
                    <h3>Task Manager</h3>
                </header>
                <main>
                    <div style={{ flexDirection: 'column' }} className="card-title-form">
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%' }}
                            value={username}
                            placeholder="Enter your username here"
                            name="username"
                            className="card-title card-title-input" />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%' }}
                            value={password}
                            placeholder="Enter your password here"
                            name="password"
                            className="card-title card-title-input" />

                        {isLog ? <Link to={'/tasks'}>Go to the tasks</Link >:
                            <div className="logIn-buttons">
                                <form onSubmit={onSubmitSignIn}>
                                    <ButtonCard width={'100%'} label={'Log In'} />
                                </form>
                                <form onSubmit={onSubmitSignUp}>
                                    <ButtonCard width={'100%'} label={'Sign Up'} />
                                </form>
                            </div>
                        }


                    </div>

                </main>
                <footer>
                    {success ? null : <p style={{ color: 'red' }}>User with that username is already exists or wrong password</p>}
                </footer>
            </div>
        </>
    )
}