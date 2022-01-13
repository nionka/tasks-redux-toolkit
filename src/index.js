import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { completeTask, getTasks, getTasksLoadingStatus, taskDeleted, titleChanged, loadTasks, createTask } from './store/task';
import configureStore from './store/store';
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { getError } from './store/error';

const store = configureStore();

const App = () => {
  const state = useSelector(getTasks());
  const isLoading = useSelector(getTasksLoadingStatus());
  const error = useSelector(getError());
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTasks());
  }, []);

  const changeTitle = (taskId) => {
    dispatch(titleChanged(taskId));
  }

  const deleteTask = (taskId) => {
    dispatch(taskDeleted(taskId));
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>{error}</h1>
  }

  return (
    <>
      <h1>App</h1>
      <button onClick={() => dispatch(createTask())}>Create new task</button>
      <ul>
        {state.map((task) => (
          <li key={task.id}>
            <p>{task.title}</p>
            <p>Completed: {`${task.completed}`}</p>
            <button onClick={() => dispatch(completeTask(task.id))}>complete</button>
            <button onClick={() => changeTitle(task.id)}>change title</button>
            <button onClick={() => deleteTask(task.id)}>delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
