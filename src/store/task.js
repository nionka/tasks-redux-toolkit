import { createSlice } from '@reduxjs/toolkit';
import todosService from '../services/todos.service';
import { setError } from './error';

const initialState = {
    entities: [],
    isLoading: true,
};

const taskSlice = createSlice({ name: 'task', initialState, reducers: {
    recived (state, action) {
        state.entities = action.payload;
        state.isLoading = false;
    },
    update (state, action) {
        const elementIndex = state.entities.findIndex((el) => el.id === action.payload.id);
        state.entities[elementIndex] = { ...state.entities[elementIndex], ...action.payload};
    },
    create (state, action) {
        state.entities = [action.payload, ...state.entities];
        state.isLoading = false;
    },
    remove (state, action) {
        state.entities = state.entities.filter((task) => task.id !== action.payload.id)
    },
    taskRequested (state) {
        state.isLoading = true;
    },
    taskRequestFailed (state) {
        state.isLoading = false;
    }
}})

const { actions, reducer: taskReducer } = taskSlice;
const { update, remove, recived, create, taskRequested, taskRequestFailed } = actions;

export const loadTasks = () => async (dispatch) => {
    dispatch(taskRequested())
    try {
        const data = await todosService.fetch();
        dispatch(recived(data));
    } catch (error) {
        dispatch(taskRequestFailed());
        dispatch(setError(error.message));
    }
}

export const createTask = () => async (dispatch) => {
    dispatch(taskRequested())
    const newTask = {
        title: 'New task',
        completed: false
    };

    try {
        const data = await todosService.create(newTask);
        dispatch(create(data));
    } catch (error) {
        dispatch(taskRequestFailed());
        dispatch(setError(error.message));
    }
}

export const completeTask = (id) => (dispatch, getState) => {
    dispatch(update({ id, completed: true }));
}

export function titleChanged (id) {
    return update({ id, title: `New title for ${id}` })
}

export function taskDeleted (id) {
    return remove({ id })
}

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

export default taskReducer
