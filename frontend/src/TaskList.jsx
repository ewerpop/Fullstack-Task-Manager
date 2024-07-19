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
        let resultJSON = JSON.parse(result)
        console.log(resultJSON)
        let newResult = resultJSON.data.map((e) => {
          return { ...e, steps: e.steps.sort((a, b) => a.index - b.index) }
        })
        setInitialState(newResult.sort((a, b) => a.index - b.index))
      })
  }
  async function getData2() {
    fetch('/todo-items/get',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({data: {id: localStorage.getItem('user_id')}})
    })
    .then((res) => res.json())
    .then((result) => {
      let resultJSON = JSON.parse(result)
      console.log(resultJSON)
      let newResult = resultJSON.data.map((e) => {
        return { ...e, steps: e.steps.sort((a, b) => a.index - b.index) }
      })
      setInitialState(newResult.sort((a, b) => a.index - b.index))
    })
  }

  useEffect(() => {
    getData2()
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
    const indexOfEl = steps.indexOf(steps.find((e) => e.index + 1 === index))

    if (index === 0) {
      steps[0].index = steps[1].index / 2
      const newSteps = steps.map((c) => {
        if (c.index === activeStep) {
          return { ...c, index: 0 }
        }
        return c
      }).sort((a, b) => a.index - b.index)
      postData({ action: 'Special move step', num1: steps[0].num, step_index1: steps[1].index / 2, num2: findActiveStep.num, step_index2: 0 }, {target: 0})
      return clearState.concat([{ ...findCard, steps: newSteps }]).sort((a, b) => a.index - b.index)
    }

    if (index === steps[steps.length - 1].index + 1) {
      const newIndex = steps.find((e) => e.index === index - 1).index * 1.5
      const newSteps = steps.map((c) => {
        if (c.index === activeStep) {
          return { ...c, index: newIndex }
        } return c
      }).sort((a, b) => a.index - b.index)
      postData({ action: 'Move step', num: findActiveStep.num, step_index: newIndex }, {target: 0})
      return clearState.concat([{ ...findCard, steps: newSteps }]).sort((a, b) => a.index - b.index)
    }

    const newIndex = (steps[indexOfEl].index + steps[indexOfEl + 1].index) / 2

    const newState = steps.map((c) => {
      if (c.index === activeStep) {
        return { ...c, index: newIndex }
      }
      return c
    }).sort((a, b) => a.index - b.index)

    postData({ action: 'Move step', num: findActiveStep.num, step_index: newIndex }, {target: 0})

    return clearState.concat([{ ...findCard, steps: newState }]).sort((a, b) => a.index - b.index)

  }

  const moveTask = (state, index) => {
    const findActiveCard = state.find((c) => c.index === activeCard)
    const indexOfEl = state.indexOf(state.find((e) => e.index + 1 === index))

    if (index === 0) {
      state[0].index = state[1].index / 2
      postData({ action: 'Special move task', id1: state[0].id, task_index1: state[1].index / 2, id2: findActiveCard.id, task_index2: 0 }, {target: 0})
      return state.map((c) => {
        if (c.index === activeCard) {
          return { ...c, index: 0 }
        }
        return c
      }).sort((a, b) => a.index - b.index)
    }

    if (index === state[state.length - 1].index + 1) {
      const newIndex = state.find((e) => e.index === index - 1).index * 1.5
      postData({ action: 'Move task', num: findActiveCard.num, step_index: newIndex }, {target: 0})
      return state.map((c) => {
        if (c.index === activeCard) {
          return { ...c, index: newIndex }
        }
        return c
      }).sort((a, b) => a.index - b.index)
    }

    let newIndex = (state[indexOfEl].index + state[indexOfEl + 1].index) / 2

    const newState = state.map((c) => {
      if (c.index === activeCard) {
        return { ...c, index: newIndex }
      }
      return c
    })
    console.log(findActiveCard.id)

    postData({ action: 'Move task', id: findActiveCard.id, task_index: newIndex }, {target: 0})

    return newState.sort((a, b) => a.index - b.index)
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

  const addTask = (state, title, id, task_index) => {
    return state.concat([{ id: id, title: title, steps: [], index: task_index * 1000 }])
  }

  const addStep = (state, label, id, num, step_index) => {
    const task = state.find((e) => e.id === id);
    if (task) {
      return state.map((e) => e.id === id ? { ...e, steps: e.steps.concat([{ num: num, label: label, done: false, index: step_index * 1000 }]) } : e);
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

  const reducer = (state, { action, id, title, label, num, done, index, value, step_index, task_index }) => {
    switch (action) {
      case 'Delete':
        return deleteTask(state, id)
      case 'Edit':
        return editTask(state, title, id)
      case 'Add':
        return addTask(state, title, id, task_index)
      case 'Add step':
        return addStep(state, label, id, num, step_index)
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


  useEffect(() => {
    dispatch({ action: 'New', value: initialState })
  }, [initialState])

  async function putData() {

    let res = await fetch('/todo-items', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ data: state })
    })
  }

  async function postData(obj, objFront) {
    fetch('/todo-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ data: obj })
    })
      .then(res => res.json())
      .then(result => {
        const resultJSON = JSON.parse(result)
        if (objFront.target) {
          if (objFront.target === 'task') {
            dispatch({ ...objFront, id: resultJSON.data.id })
          } else if (objFront.target === 'step') {
            dispatch({ ...objFront, num: resultJSON.data.id })
          }
        }

      })
  }

  return (
    <React.Fragment>
      <h1>Task manager</h1>
      <DropArea onDrop={() => dispatch({ index: 0, action: 'Move' })} />
      <ol className="lane">
        {state.map((e) => {
          return (
            <React.Fragment key={e.id} >
              <Task postData={postData} state={state} moveStep={dispatch} setActiveStep={setActiveStep} setActiveCard={setActiveCard} index={e.index} task={e} editTask={dispatch} deleteTask={dispatch} addStep={dispatch} doneStep={dispatch} deleteStep={dispatch} />
              <DropArea index={e.index} onDrop={() => dispatch({ index: e.index + 1, action: 'Move' })} />
            </React.Fragment>
          )
        })}
        <TaskAdd addTask={dispatch} state={state} postData={postData} />
        <form onSubmit={(e) => {
          e.preventDefault()
          putData()
        }}>
          <Button icon={'plus'} label={'save'} />
        </form>

      </ol>
    </React.Fragment>
  );
}

export default TaskList;