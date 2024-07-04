import Task from "./Task";
import TaskAdd from "./TaskAdd";
import { useEffect, useReducer, useState } from "react";
import React from "react";
import DropArea from "./DropArea";
import Button from "./Button";


// это список, где отображаются все карточки с заданиями

function TaskList() {


  const [activeStep, setActiveStep] = useState(null)
  const [activeCard, setActiveCard] = useState(null) //* activeCard принимает значение index, той карточки, которую сейчас перетаскивают
  const [initialState, setInitialState] = useState([])

  async function getData() {
    fetch('/todo-items')
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        let resultJSON = JSON.parse(result)
        console.log(resultJSON.data)
        setInitialState(resultJSON.data)})
  }


  useEffect(() => {
    getData()
  }, [])

  // ! далее идут функции для reducer

  const newState = (value) => {
    return value
  }

  const moveStep = (state, id, index) => {
    const findCard = state.find((c) => c.id === id)
    const steps = findCard.steps
    const findActiveStep = steps.find((c) => c.index === activeStep)
    const clearState = state.filter((c) => c.id !== id)

    const newState = steps.map((c) => {
      if (c.index === activeStep) {
        return { ...c, index: index }
      }
      return c
    })

    const newSteps = newState.map((c) => {

      if (c.index >= index && c.num !== findActiveStep.num && c.index <= activeStep) {
        return { ...c, index: c.index + 1 }
      }

      return c
    }).sort((a, b) => a.index - b.index)

    return clearState.concat([{ ...findCard, steps: newSteps }]).sort((a, b) => a.index - b.index)

  }

  const moveTask = (state, index) => {

    const findActiveCard = state.find((c) => c.index === activeCard)

    const newState = state.map((c) => {
      if (c.index === activeCard) {
        return { ...c, index: index }
      }
      return c
    })

    return newState.map((c) => {

      if (c.index >= index && c.id !== findActiveCard.id && c.index <= activeCard) {
        return { ...c, index: c.index + 1 }
      }

      return c
    }).sort((a, b) => a.index - b.index)
  }

  const deleteTask = (state, id) => {
    return state.filter((e) => e.id !== id)
  }

  const editTask = (state, title, id) => {
    return state.map((e) => e.id === id ? { ...e, title: title } : e)
  }

  const sortState = (state) => {
    return state.sort((a, b) => a.index - b.index)
  }

  const addTask = (state, title) => {
    return state.concat([{ id: Date.now(), title: title, steps: [], index: state.length }])
  }

  const addStep = (state, label, id) => {
    const task = state.find((e) => e.id === id);
    if (task) {
      return state.map((e) => e.id === id ? { ...e, steps: e.steps.concat([{ num: Date.now(), label: label, done: false, index: e.steps.length }]) } : e);
    }
    return state;
  }

  const deleteStep = (state, id, num) => {
    const task = state.find((e) => e.id === id);
    if (task) {
      return state.map((e) => e.id === id ? { ...e, steps: e.steps.filter((e) => e.num !== num) } : e);
    }
    return state;
  }

  const doneStep = (state, id, num, done) => {
    const task = state.find((e) => e.id === id);
    if (task) {
      return state.map((e) => e.id === id ? { ...e, steps: e.steps.map((el) => el.num === num ? { ...el, done: !done } : el) } : e);
    }
    return state;
  }

  const reducer = (state, { action, id, title, label, num, done, index, value }) => {
    switch (action) {
      case 'Delete':
        return deleteTask(state, id)
      case 'Edit':
        return editTask(state, title, id)
      case 'Add':
        return addTask(state, title)
      case 'Add step':
        return addStep(state, label, id)
      case 'Delete step':
        return deleteStep(state, id, num)
      case 'Done step':
        return doneStep(state, id, num, done)
      case 'Move':
        return moveTask(state, index)
      case 'Move step':
        return moveStep(state, id, index)
      case 'Sort':
        return sortState(state)
      case 'New':
        return newState(value)
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  console.log(initialState) 

  useEffect(() => {
    dispatch({action: 'New', value: initialState})
  }, [initialState])

  async function postData() {

    let res = await fetch('/todo-items', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({data: state})
    })
  }

  console.log(state)
  return (
    <React.Fragment>
      <DropArea onDrop={() => dispatch({ index: 0, action: 'Move' })} />
      <ol className="lane">
        {state.map((e) => {
          return (
            <React.Fragment key={e.id} >
              <Task moveStep={dispatch} setActiveStep={setActiveStep} setActiveCard={setActiveCard} index={e.index} task={e} editTask={dispatch} deleteTask={dispatch} addStep={dispatch} doneStep={dispatch} deleteStep={dispatch} />
              <DropArea index={e.index} onDrop={() => dispatch({ index: e.index + 1, action: 'Move' })} />
            </React.Fragment>
          )
        })}
        <TaskAdd addTask={dispatch} />
        <form onSubmit={(e) => {
          e.preventDefault()
          postData()
        }}>
          <Button icon={'plus'} label={'save'}/>
        </form>
        
      </ol>
    </React.Fragment>
  );
}

export default TaskList;