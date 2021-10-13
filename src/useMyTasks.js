import { set } from 'lodash'
import { myTodos, myTodos2 } from './index'

export const useMyTasks = () => {
  const handle = (task) => {
    console.log('handle', task)
    const x = myTodos()
    const y = set(x, task.id, task)
    myTodos(y)
    console.log('myTodos... you can see a second item has been added!', myTodos())
  }
  return { handle }
}

export const useMyTasks2 = () => {
  const handle2 = (task) => {
    console.log('handle', task)
    const x = myTodos2()
    // const y = set(x, task.id, task)
    myTodos2({ [task.id]: task })
    console.log('myTodos2', myTodos2())
  }
  return { handle2 }
}
